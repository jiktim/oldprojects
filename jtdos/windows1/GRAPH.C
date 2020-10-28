/* graph.c */

#include    "windows.h"
#include    "events.h"
#include    "menu.h"
#include    "graph.h"

#define  MAXGSERIES 2
#define  IDMSGCTL1  1001
#define  IDMSGCTL2  1002
#define  IDMSGCTL3  1003
#define  IDMSGCTL4  1004
#define  IDMSGCTL5  1005
#define  chRETURN   13
#define  IDIGNORE   4096

/* Debug aids */
HWND    hCtlMsg[MAXCTLMSG];
BOOL    fChkBox[MAXCHKBOX];
BOOL    fPshBtn[MAXPSHBTN];
int     iRadBtn;

HBRUSH   hbrGray;
HBRUSH   hbrBlack;
HBRUSH   hbrWhite;
HPEN     hpenBlack;
FARPROC  lpprocRefreshEnum;
    /* farprocs to send to DialogBox() */
FARPROC  lpprocQuitDialog, lpprocFigSizeDialog, lpprocDebugDialog;
HCURSOR  hCursorGRAPH;

extern HCURSOR     hCursorTB;
extern HCURSOR     hCursorLR;
extern HCURSOR     hCursorBLUR;
extern HCURSOR     hCursorTLBR;
extern HCURSOR     hCursorMOVE;
extern HCURSOR     hCursorBOX;
extern HCURSOR     hCursor[ BRIGHT+1 ];

/* found in figure.c */
extern   HWND   hFigure;
extern   int    modeSize;       /* IDMCLIP or IDMSCALE */
extern   int    cItems;         /* number of items in figure */
extern   int    gallery;        /* BAR COLUMN */
extern   RECT   rectClip;       /* size of figure when IDMCLIP */
extern   RECT   rectFigWin;     /* rect of Figure window wrt char window */

/* used to init a new gseries window */
int      iGSInit;

HANDLE   hDlg;          /* dialog box */
HANDLE   hRF;           /* resource file */

HWND     hGSeries[MAXGSERIES];      /* handles of GSeries child windows */
RECT     rectGSeries[MAXGSERIES];   /* parent relative rects */

HANDLE   hModuleGraph;
HWND     hWwGraph;
HWND     hTopChild;

FARPROC     lpDestroyContinue;
BOOL        fDestroyOK = FALSE;

/* used by Refresh to pass info to RefreshEnum */
RECT    rectEnum;
HWND    hWwEnum;
int     CharWidth;
int     CharHeight;


int FAR PASCAL GraphCreate( hWindow )
HWND    hWindow;                /* A handle to a window data structure */
{
    extern  HWND    CreateMsgCtl();
    HWND    hWw;
    int     i, x, y;
    TEXTMETRIC LocalTextMetric;
    HDC     hDC;  /* to get text metric info */

        /* Make this guy device [font] independent  */
    hDC = GetDC( hWindow );
    GetTextMetrics( hDC, (TEXTMETRIC FAR *)&LocalTextMetric);
    ReleaseDC( hWindow, hDC );
    CharWidth = LocalTextMetric.tmMaxCharWidth;
    CharHeight = LocalTextMetric.tmHeight + LocalTextMetric.tmLeading;

    for (i = 0; i < MAXCTLMSG; i++ )
      hCtlMsg[i] = CreateMsgCtl( hWindow,
                                 1001,  0,
                                 CharHeight*2*i,
                                 8*CharWidth,
                                 2 * CharHeight );

    for (i = 0; i < MAXCHKBOX; i++ )
        fChkBox[i] = FALSE;
    for (i = 0; i < MAXPSHBTN; i++ )
        fPshBtn[i] = FALSE;
    iRadBtn = 0;

    hWwGraph  = hWindow;

    for (i = MAXGSERIES - 1; i >= 0; i-- ) {
        iGSInit = i;
        x = 350 + i*15;
        y = 60 - i*12;
        SetRect( (LPRECT)&rectGSeries[i], x, y, x + 200, y + 50 );
        hGSeries[i] = CreateChild(
            (LPSTR)"GSeries",                   /* class name        */
            hWindow,                            /* parent window     */
            (LPSTR)"GSeries",                   /* window name       */
            TRUE,                               /* border            */
            TRUE,                               /* visible           */
            TRUE,                               /* overlap           */
            FALSE,                              /* horizontal scroll */
            FALSE,                              /* vertical   scroll */
            rectGSeries[i].left,                /* x coord           */
            rectGSeries[i].top,                 /* y coord           */
            rectGSeries[i].right - rectGSeries[i].left, /* width     */
            rectGSeries[i].bottom - rectGSeries[i].top, /* height    */
            hModuleGraph                        /* module            */
            );
        }

    SetRect( (LPRECT)&rectFigWin, 45, 45, 300, 150 );
    hFigure = CreateChild(
        (LPSTR)"Figure",                    /* class name        */
        hWindow,                            /* parent window     */
        (LPSTR)"Figure",                    /* window name       */
        TRUE,                               /* border            */
        TRUE,                               /* visible           */
        TRUE,                               /* overlap           */
        FALSE,                              /* horizontal scroll */
        FALSE,                              /* vertical   scroll */
        rectFigWin.left,                    /* x coord           */
        rectFigWin.top,                     /* y coord           */
        rectFigWin.right - rectFigWin.left, /* width             */
        rectFigWin.bottom - rectFigWin.top, /* height            */
        hModuleGraph                        /* module            */
        );
    CheckMenu( hWindow, SIZE, CLIP,  modeSize == IDMCLIP );
    CheckMenu( hWindow, SIZE, SCALE, modeSize == IDMSCALE );
    CheckMenu( hWindow, GALLERY, COLUMN, gallery == IDMCOLUMN );
    CheckMenu( hWindow, GALLERY, BAR   , gallery == IDMBAR );

}


BOOL far PASCAL GraphDestroy(hwnd, command, lpProc)
HWND    hwnd;
int     command;
FARPROC lpProc;
{
    if (command == QUERYDESTROY) {
        if (!fDestroyOK) {
            lpDestroyContinue = lpProc;
            DialogBox( hwnd, lpprocQuitDialog, (LPSTR)"IDIQUIT");
        }
        return(fDestroyOK);
    }
    FreeModule( hModuleGraph );
}


int far PASCAL GraphPaint( hWindow, hDC, eraseFlag, lpRectangle, pHint )
HWND    hWindow;                /* a handle to a window data structure */
HDC     hDC;                    /* a handle to a GDI display context */
BOOL    eraseFlag;              /* a flag telling whether the background has been erased */
LPRECT  lpRectangle;            /* a long pointer to a rectangle data structure indicating the minimum area which MUST be repainted */
LPINT   pHint;                 /* a long pointer to a client or window manager supplied hint */
{
    int     Tx, Ty;                     /* Total size of available window */
    RECT    lpSize;

        /* since it is easy to resize we'll do it on every repaint */
    GetClientRect( hWindow, (LPRECT)&lpSize );
    Tx = lpSize.right - lpSize.left;
    Ty = lpSize.bottom - lpSize.top;
    EnumChildWindows( hWwGraph,  /* new */
        lpprocRefreshEnum );
}

int FAR PASCAL GraphInput(hWindow, argc, argv)
HWND        hWindow;                /* A handle to a window data structure  */
int         argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;              /* A list of result "right hand sides"  */
{                               /* The results are of fixed size.       */
    HANDLE      hDC;
    POINT       ptMouse;
    int         evt;

    if ( argc == 2 && argv[1].type == MSCRDCODE ) {
        evt = argv[0].resval.numval.n;
        ptMouse.x = argv[1].resval.mouseval.x;
        ptMouse.y = argv[1].resval.mouseval.y;

        switch (evt & EVTGRBFCN) { /* mask off shift ctl */
            case EVTB1DN:
            case EVTB2DN:
                break;
            case EVTB1UP:
            case EVTB2UP:
                SetFocus( hFigure, (HANDLE)NULL, (FARPROC)NULL );
                break;
            case EVTMSMOVE:
                break;
            default:
                break;
            };
        }   /* end of mouse, button event processing */
    else if ( (evt = argv[0].resval.numval.n) > 255 )
        DoMenu( hWindow, evt );
}                          /* end of input proc */



int far PASCAL GraphFree(hInstance, fLastInstance)
HANDLE  hInstance;
BOOL fLastInstance;
{
    if (fLastInstance) {
        CloseResourceFile(hRF);
    }
}

/*********************************************************************/


DoMenu( hWindow, evt)
HWND    hWindow;
int     evt;
{
    switch (evt) {
        case IDMCOLUMN:
        case IDMBAR:
            if (evt != gallery) {
                gallery = evt;
                RedrawFigure( hFigure );
                }
            CheckMenu( hWindow, GALLERY, COLUMN, gallery == IDMCOLUMN );
            CheckMenu( hWindow, GALLERY, BAR   , gallery == IDMBAR );
            break;
        case IDMINCREMENT:
            cItems++;
            RedrawFigure( hFigure );
            break;
        case IDMDECREMENT:
            cItems--;
            RedrawFigure( hFigure );
            break;
        case IDMCLIP:
        case IDMSCALE:
            if ( evt != modeSize ) {
                modeSize = evt;
                RedrawFigure( hFigure );
                }
            CheckMenu( hWindow, SIZE, CLIP , modeSize == IDMCLIP );
            CheckMenu( hWindow, SIZE, SCALE, modeSize == IDMSCALE );
            break;
        case IDMSETSIZE:
            DialogBox( hWindow, lpprocFigSizeDialog, (LPSTR)"IDIFIGSIZE" );
            break;
        case IDMDEBUGMI1:
        case IDMDEBUGMI2:
        case IDMDEBUGMI3:
        case IDMDEBUGMI4:
        case IDMDEBUGMI5:
            {
            int i = evt - IDMDEBUGMI1;
            ShowCtl( hCtlMsg[i], !IsCtlVisible( hCtlMsg[i] ) );
            SetCtlInt( hCtlMsg[i], 0 );
            }
            break;
        case IDMDEBUGDLG:
            DialogBox( hWindow, lpprocDebugDialog, (LPSTR)"IDIDEBUG" );
            break;
        default:
            break;
        };
}

CheckMenu( hWindow, iSubmenu, iItem, fCheck )
HWND    hWindow;
int     iSubmenu;
int     iItem;
BOOL    fCheck;
{
    CheckMenuItem( QuerySubMenu( GetMenu( hWindow ), iSubmenu ),
        iItem, fCheck );
}

int FAR PASCAL FigSizeDialog( hDlg, cArg, rgArg )
HWND    hDlg;
int     cArg;
LPRESULTBLOCK   rgArg;
{
    int     i, id;


    if ( rgArg[0].type == CHARCODE || rgArg[0].type == STRCODE ) {
        CHAR    ch;
        LPSTR   lpstr;
        int     ich;

        lpstr = (rgArg[0].type == CHARCODE ? (LPSTR)rgArg[0].resval.charval.c :
                (LPSTR)rgArg[0].resval.strval.pStr );
        for ( ich = 0; ich < rgArg[0].len; ich++ ) {

            if ( iRadBtn == 3 && IsCtlVisible( hCtlMsg[1] ) )
                SetCtlInt( hCtlMsg[1], *lpstr );

            switch ( ch = *lpstr++ ) {
                case chRETURN:
                    id = IDMOK;
                    break;
                default:
                    id = IDIGNORE;
                    break;
                }
            };
        }   /* end of char event processing */
    else id = rgArg[0].resval.numval.n;

    if ( iRadBtn == 3 && IsCtlVisible( hCtlMsg[0] ) )
        SetCtlInt( hCtlMsg[0], id );

    switch ( id ) {
        char    rgch[10];

        case 0:
            SetDlgItemInt( hDlg, IDDWIDTH ,  rectClip.right - rectClip.left );
            SetDlgItemInt( hDlg, IDDHEIGHT,  rectClip.bottom - rectClip.top );
            SetDlgItemInt( hDlg, IDDXORIGIN, rectClip.left   );
            SetDlgItemInt( hDlg, IDDYORIGIN, rectClip.bottom );
            SetDlgItemInt( hDlg, IDDCITEMS , cItems          );
            break;
        case IDMOK:
            rectClip.left   = GetDlgItemInt( hDlg, IDDXORIGIN );
            rectClip.bottom = GetDlgItemInt( hDlg, IDDYORIGIN );
            rectClip.right  = rectClip.left   + GetDlgItemInt( hDlg, IDDWIDTH  );
            rectClip.top    = rectClip.bottom - GetDlgItemInt( hDlg, IDDHEIGHT );
            cItems          = GetDlgItemInt( hDlg, IDDCITEMS );
            DestroyDlg( hDlg );
            modeSize = IDMCLIP;
            CheckMenu( hWwGraph, SIZE, CLIP , TRUE  );
            CheckMenu( hWwGraph, SIZE, SCALE, FALSE );
            RedrawFigure( hFigure );
            break;
        case IDMCANCEL:
            DestroyDlg( hDlg );
            break;
        case IDIGNORE:
            break;
        default:
            return FALSE;
        }
    return TRUE;
}

int FAR PASCAL DebugDialog( hDlg, cArg, rgArg )
HWND    hDlg;
int     cArg;
LPRESULTBLOCK   rgArg;
{
    int     i, id;
    BOOL    fPBOld, fPBNew; /* push button states */


    if ( rgArg[0].type == CHARCODE || rgArg[0].type == STRCODE ) {
        CHAR    ch;
        LPSTR   lpstr;
        int     ich;

        lpstr = (rgArg[0].type == CHARCODE ? (LPSTR)rgArg[0].resval.charval.c :
                (LPSTR)rgArg[0].resval.strval.pStr );
        for ( ich = 0; ich < rgArg[0].len; ich++ ) {

            if ( iRadBtn == 3 && IsCtlVisible( hCtlMsg[1] ) )
                SetCtlInt( hCtlMsg[1], *lpstr );

            switch ( ch = *lpstr++ ) {
                case chRETURN:
                    id = IDMOK;
                    break;
                default:
                    id = IDIGNORE;
                    break;
                }
            };
        }   /* end of char event processing */
    else id = rgArg[0].resval.numval.n;

    if ( iRadBtn == 3 && IsCtlVisible( hCtlMsg[0] ) )
        SetCtlInt( hCtlMsg[0], id );

    switch ( id ) {
        char    rgch[10];

        case 0:
            /*
            SetDlgItemInt( hDlg, IDDWIDTH , rectClip.right - rectClip.left );
            */
            SetDlgItemInt( hDlg, IDDDBGTXT1 , 0 );
            SetDlgItemInt( hDlg, IDDDBGTXT2 , 0 );
            SetDlgItemInt( hDlg, IDDDBGTXT3 , 0 );
            SetDlgItemInt( hDlg, IDDDBGTXT4 , 0 );
            SetDlgItemInt( hDlg, IDDDBGTXT5 , 0 );
            for (i = 0; i < MAXPSHBTN; i++ )
                DlgItemMsg1( hDlg, IDDDBGPB1 + i, BMSETSTATE, fPshBtn[i] );
            for (i = 0; i < MAXCHKBOX; i++ )
                CheckDlgButton( hDlg, IDDDBGCB1 + i, fChkBox[i] );
            for (i = 0; i < MAXRADBTN; i++ )
                CheckDlgButton( hDlg, IDDDBGRB1 + i, i == iRadBtn );
            break;
        case IDDDBGPB1:
        case IDDDBGPB2:
        case IDDDBGPB3:
        case IDDDBGPB4:
            /* user has just release button over push button        */
            /* push button was hilited while down, but is no longer */
            /* this app currently does nothing with pushbuttons     */
            break;
        case IDDDBGPB5:
            SetDlgItemText(hDlg, IDDDBGTXT5, (LPSTR)"button 5 pushed" );
            break;
        case IDDDBGRB1:
        case IDDDBGRB2:
        case IDDDBGRB3:
        case IDDDBGRB4:
        case IDDDBGRB5:
            for (i = 0; i < MAXRADBTN; i++ )
                CheckDlgButton( hDlg, IDDDBGRB1 + i, IDDDBGRB1 + i == id );
            break;
        case IDMOK:
            /* store setting */
            for (i = 0; i < MAXCHKBOX; i++ )
                fChkBox[i] = IsDlgButtonChecked( hDlg, IDDDBGCB1 + i );
            for (i = 0; i < MAXPSHBTN; i++ )
                fPshBtn[i] =
                    DlgItemMsg1( hDlg, IDDDBGPB1 + i, BMGETSTATE, 0 );
            for (i = 0; i < MAXRADBTN; i++ ) {
                if ( IsDlgButtonChecked( hDlg, IDDDBGRB1 + i ) )
                    iRadBtn = i;
                };
            DestroyDlg( hDlg );
            break;
        case IDMCANCEL:
            /* restore settings */
            for (i = 0; i < MAXPSHBTN; i++ )
                DlgItemMsg1( hDlg, IDDDBGPB1 + i, BMSETSTATE, fPshBtn[i] );
            for (i = 0; i < MAXCHKBOX; i++ )
                CheckDlgButton( hDlg, IDDDBGCB1 + i, fChkBox[i] );
            for (i = 0; i < MAXRADBTN; i++ )
                CheckDlgButton( hDlg, IDDDBGRB1 + i, i == iRadBtn );
            DestroyDlg( hDlg );
            break;
        case IDIGNORE:
            break;
        default:
            return FALSE;
        }
    return TRUE;
}

int far PASCAL QuitDialog (hdlg, cArg, rgArg)
HWND hdlg;
int cArg;
LPRESULTBLOCK rgArg;
{
    switch (rgArg[0].resval.numval.n) {
    case 0:
        break;
    case IDDYES:
        CloseDialogBox(hdlg);
        fDestroyOK = TRUE;
        (*lpDestroyContinue)(hWwGraph);
        break;
    case IDDNO:
        CloseDialogBox(hdlg);
        break;
    default:
        return(FALSE);
    }
    return(TRUE);
}

HWND CreateMsgCtl( hParent, id, x, y, cx, cy )
HWND    hParent;
int     id, x, y, cx, cy ;
{
    CTLDEF  ctd;
    HDC     hdc;

    ctd.lpszClass = (LPSTR)"Edit";
    ctd.hwndParent = hParent;
    ctd.lpszText = (LPSTR)NULL;
    ctd.style = ELEFT | EFRAMED;
    ctd.x = x;
    ctd.y = y;
    ctd.cx = cx;
    ctd.cy = cy;
    ctd.bBorder = FALSE;
    ctd.bVisible = FALSE;
    ctd.bOverlap = TRUE;
    ctd.bHScroll = FALSE;
    ctd.bVScroll = FALSE;
    ctd.ID = id;
    return CreateCtl((LPCTLDEF)&ctd);
}

BOOL far PASCAL RefreshEnum( hChild )
HWND    hChild;
{
    RECT    rectChild, rectIntersect, rect;
    POINT   ptC, ptG;

    if ( hChild == hWwEnum ) return TRUE;
    ptC.x = ptG.x = ptC.y = ptG.y = 0;
    rect = rectEnum;
    GetClientRect( hChild, (LPRECT)&rectChild );    /* child in child coord */
    ClientToScreen( hWwGraph, (LPPOINT)&ptG );     /* paren origin in screen */
    ClientToScreen( hChild, (LPPOINT)&ptC );
    OffsetRect( (LPRECT)&rect, ptG.x - ptC.x, ptG.y - ptC.y );    /* rect in child          */
    IntersectRect( (LPRECT)&rectIntersect, (LPRECT)&rect, (LPRECT)&rectChild );
    if ( IsRectEmpty( (LPRECT)&rectIntersect ) ) return TRUE;
    PaintWindow( hChild, TRUE, (LPRECT)&rectIntersect, (LPINT)NULL );
    return TRUE;
}

Refresh( hWindow, lprect, hWwExcept )
HWND    hWindow;
LPRECT  lprect;
HWND    hWwExcept;
{
/* repaint all children except hWwExcept that intersect lprect */
    rectEnum = *lprect;
    hWwEnum  = hWwExcept;
    EnumChildWindows( hWwGraph,
        lpprocRefreshEnum );
}


InitStatics()
{
    fDestroyOK = FALSE;

    FigureInitStatics();
    GSeriesInitStatics();
}


GraphInit()
{
    PWNDCLASS   pGraphClass;

    hbrWhite    = GetStockObject( WHITE_BRUSH );
    hbrGray     = GetStockObject( GRAY_BRUSH );
    hbrBlack    = GetStockObject( BLACK_BRUSH );
    hpenBlack   = GetStockObject( BLACK_PEN );

    pGraphClass = (PWNDCLASS) calloc( 1, sizeof( WNDCLASS ) );
    pGraphClass->lpClsName    = (LPSTR) "Graph";

    if (hRF = OpenResourceFile( (LPSTR)"graph.res" )) {
        pGraphClass->hClsItTable = ItLoad( hRF,(LPSTR)"graph" );
        pGraphClass->hClsCursor  = hCursorGRAPH =
            CursorLoad( hRF, (LPSTR)"graph" );
        pGraphClass->hClsIconId  = IconLoad( hRF,(LPSTR)"graph" );
        pGraphClass->hMenu       = MenuLoad( hRF,(LPSTR)"MenuBar" );
        }

    pGraphClass->hBackBrush   = hbrWhite;

    pGraphClass->vUpdate       = REDRAW;
    pGraphClass->hUpdate       = REDRAW;

    pGraphClass->clsWndCreate  = GraphCreate;
    pGraphClass->clsWndInput   = GraphInput;
    pGraphClass->clsWndPaint   = GraphPaint;
    pGraphClass->clsWndDestroy = GraphDestroy;

    if (!RegisterClass( (LPWNDCLASS)pGraphClass ) )
        return FALSE;   /* Initialization failed */

    free( (char *) pGraphClass );

    /* register Figure class with WINDOWS */
    if (!RegisterFigure() )
        return FALSE;   /* Initialization failed */

    /* register GSeries class with WINDOWS */
    if (!RegisterGSeries() )
        return FALSE;   /* Initialization failed */

    return TRUE;    /* Initialization succeeded */
}


BOOL far PASCAL GraphLoad( hInstance, hPrev, lpParms )
HANDLE hInstance;
HANDLE hPrev;
LPNEWPARMS lpParms;
{
    if (!hPrev) {
        if (!GraphInit())
            return FALSE;
        }
    else {
            /* Copy global instance variables from previous instance */
        GetInstanceData( hPrev, (PSTR)&hbrWhite, sizeof( hbrWhite ) );
        GetInstanceData( hPrev, (PSTR)&hbrBlack, sizeof( hbrBlack ) );
        GetInstanceData( hPrev, (PSTR)&hbrGray,  sizeof( hbrGray ) );
        GetInstanceData( hPrev, (PSTR)&hpenBlack,sizeof( hpenBlack) );
        GetInstanceData( hPrev, (PSTR)&hCursorGRAPH,    sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorTB,       sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorLR,       sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorBLUR,     sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorTLBR,     sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorMOVE,     sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)&hCursorBOX,      sizeof(HCURSOR) );
        GetInstanceData( hPrev, (PSTR)hCursor,          sizeof(hCursor) );
        GetInstanceData( hPrev, (PSTR)&hRF,     sizeof(hRF) );
        }

    lpprocRefreshEnum = MakeProcInstance((FARPROC)RefreshEnum,hInstance);
    lpprocQuitDialog = MakeProcInstance((FARPROC)QuitDialog,hInstance);
    lpprocFigSizeDialog = MakeProcInstance((FARPROC)FigSizeDialog,hInstance);
    lpprocDebugDialog = MakeProcInstance((FARPROC)DebugDialog,hInstance);

    hModuleGraph = hInstance;
    InitStatics();

    lpParms->hWnd = CreateWindow(
        (LPSTR) "Graph",   /* The class name */
        (LPSTR) "Graph",   /* The window instance name */
        TRUE,               /* A flag requesting the window be created as an icon */
        FALSE,              /* A Flag requesting a vertical scroll bar */
        FALSE,              /* A Flag requesting a horizontical scroll bar */
        NULL,               /* The window instance will be created with the class default menu */
        100,                /* A desired height of one hundred screen pixels */
        0,                  /* The window wants to be opened in column zero */
        hModuleGraph
        );
    InitCtlMgr();
}
