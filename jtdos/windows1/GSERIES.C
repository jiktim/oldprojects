/* gseries.c */

#include    "windows.h"
#include    "events.h"
#include    "menu.h"
#include    "graph.h"

/* debug aids */

extern  HWND    hCtlMsg[];
extern  BOOL    fChkBox[];
extern  BOOL    fPshBtn[];
extern  int     iRadBtn;

extern  HANDLE  hRF;

extern  HBRUSH  hbrGray;
extern  HBRUSH  hbrBlack;
extern  HBRUSH  hbrWhite;
extern  HWND    hTopChild;

extern  HCURSOR     hCursorTB;
extern  HCURSOR     hCursorLR;
extern  HCURSOR     hCursorBLUR;
extern  HCURSOR     hCursorTLBR;
extern  HCURSOR     hCursorMOVE;
extern  HCURSOR     hCursorBOX;
extern  HCURSOR     hCursorGRAPH;

extern  HWND        hWwGraph;

/* used to init windows */
extern  int     iGSInit;
extern  HWND    hGSeries[];     /* handles of GSeries child windows */
extern  RECT    rectGSeries[];  /* parent relative rects */

static POINT        ptMouse;
static POINT        ptPrev;
static int          iState = SUP;
static RECT         rectImage;

int FAR PASCAL GSeriesCreate( hWindow )
HWND    hWindow;                /* A handle to a window data structure */
{
    SetProp( hWindow, (LPSTR)"iGSeries", (HANDLE)iGSInit );
}

BOOL far PASCAL GSeriesDestroy(hWindow, command, lpProc)
HWND    hWindow;
int     command;
FARPROC lpProc;
{
    RemoveProp( hWindow, (LPSTR)"iGSeries" );
    return( TRUE );
}

int FAR PASCAL GSeriesPaint( hWindow, hDC, eraseFlag, lpRectangle, pHint )
HWND    hWindow;                /* a handle to a window data structure */
HDC     hDC;                    /* a handle to a GDI display context */
BOOL    eraseFlag;              /* a flag telling whether the background has been erased */
LPRECT  lpRectangle;            /* a long pointer to a rectangle data structure indicating the minimum area which MUST be repainted */
LPINT   pHint;                 /* a long pointer to a client or window manager supplied hint */
{
    RECT    lpSize;

    GetClientRect( hWindow, (LPRECT)&lpSize );

    SelectObject( hDC, hbrBlack );

    MoveTo (hDC, 0, 12);
    LineTo (hDC, lpSize.right, 12);
    MoveTo (hDC, 9, 3);
    LineTo (hDC, 19, 3);
    LineTo (hDC, 19, 7);
    LineTo (hDC, 9, 7);
    LineTo (hDC, 9, 3);
    TextOut (hDC, 29, 2, (LPSTR)"Plot", 4);
    MoveTo (hDC, 0, 24);
    LineTo (hDC, lpSize.right, 24);
    MoveTo (hDC, 100, 12);
    LineTo (hDC, 100, lpSize.bottom);
    MoveTo (hDC, 200, 12);
    LineTo (hDC, 200, lpSize.bottom);
    TextOut (hDC, 46, 15, (LPSTR)"X", 1);
    TextOut (hDC, 146, 15, (LPSTR)"Y", 1);

    /* Now comes the information particular to each data window. */
    switch ( GetProp( hWindow, (LPSTR)"iGSeries" ) ) {
        case 0:
            /* Left-handed widgets */
            TextOut (hDC, 70, 2, (LPSTR)"Left-handed Widgets", 19);
            TextOut (hDC, 64, 27, (LPSTR)"1981", 4);
            TextOut (hDC, 180, 27, (LPSTR)"40", 2);
            TextOut (hDC, 64, 39, (LPSTR)"1982", 4);
            TextOut (hDC, 180, 39, (LPSTR)"30", 2);
            TextOut (hDC, 64, 51, (LPSTR)"1983", 4);
            TextOut (hDC, 180, 51, (LPSTR)"30", 2);
            TextOut (hDC, 64, 63, (LPSTR)"1984", 4);
            TextOut (hDC, 180, 63, (LPSTR)"20", 2);
            break;
        case 1:
            /* Right-handed widgets */
            TextOut (hDC, 70, 2, (LPSTR)"Right-handed Widgets", 20);
            TextOut (hDC, 64, 27, (LPSTR)"1981", 4);
            TextOut (hDC, 180, 27, (LPSTR)"40", 2);
            TextOut (hDC, 64, 39, (LPSTR)"1982", 4);
            TextOut (hDC, 180, 39, (LPSTR)"60", 2);
            TextOut (hDC, 64, 51, (LPSTR)"1983", 4);
            TextOut (hDC, 180, 51, (LPSTR)"30", 2);
            TextOut (hDC, 64, 63, (LPSTR)"1984", 4);
            TextOut (hDC, 180, 63, (LPSTR)"50", 2);
            break;
        default:
            /* Untitled */
            TextOut (hDC, 70, 2, (LPSTR)"Untitled", 8);
            break;
        }
}                               /* end paint proc */

int FAR PASCAL GSeriesInput(hWindow, argc, argv)
HWND        hWindow;                /* A handle to a window data structure  */
int         argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;              /* A list of result "right hand sides"  */
{                               /* The results are of fixed size.       */

    if ( IsCtlVisible( hCtlMsg[1] ) && iRadBtn == 3 )
        SetCtlInt( hCtlMsg[1], iState );

    if ( argc == 2 && argv[1].type == MSCRDCODE ) {
        int evt;
        int iWhere;
        LPRECT  lprect;

        evt = argv[0].resval.numval.n;
        ptMouse.x = argv[1].resval.mouseval.x;
        ptMouse.y = argv[1].resval.mouseval.y;

        switch (evt & EVTGRBFCN) { /* mask off shift ctl */
            case EVTB1DN:
            case EVTB2DN:

                if ( hTopChild != hWindow )
                    BringChildToTop( hTopChild = hWindow );

                if ( evt & EVTBITCTL || ( (evt & EVTGRBFCN) == EVTB2DN ) ) {
                    int     i = (int)GetProp( hWindow, (LPSTR)"iGSeries" );
                    RECT    rect;

                    SetRect( (LPRECT)&rect, 0, 0,
                        rectGSeries[i].right - rectGSeries[i].left,
                        rectGSeries[i].bottom - rectGSeries[i].top );
                    switch (iWhere =
                                Where((LPPOINT)&ptMouse, (LPRECT)&rect, 10)) {
                        case BINSIDE:
                        case BOUTSIDE:
                            iState = SMV;
                            break;
                        default:
                            iState = iWhere;    /* depends on order of B* S* */
                            break;
                        };
                    GSStartMvSt( hWindow );
                    }
                break;
            case EVTB1UP:
            case EVTB2UP:
                switch ( iState ) {
                    case SUP:
                        break;
                    default:
                        GSFinishMvSt( hWindow );
                        break;
                    };
                iState = SUP;
                SetFocus( hWindow, (HANDLE)NULL, (FARPROC)NULL );
                break;
            case EVTMSMOVE:
                switch ( iState ) {
                    case SUP:
                        if ( evt & EVTBITCTL )
                            SetCursor( hCursorMOVE );
                        else
                            SetCursor( hCursorGRAPH );
                        break;
                    default:
                        ContinueMvSt( hWwGraph, (LPPOINT)&ptPrev,
                            (LPPOINT)&ptMouse, (LPRECT)&rectImage, iState );
                        break;
                    };
                break;
            default:
                break;
            };
        }   /* end of mouse, button event processing */
    else if ( argv[0].type == CHARCODE || argv[0].type == STRCODE ) {
        CHAR    ch;
        LPSTR   lpstr;
        BOOL    fRedraw = FALSE;
        int     ich;

        lpstr = (argv[0].type == CHARCODE ? (LPSTR)argv[0].resval.charval.c :
                (LPSTR)argv[0].resval.strval.pStr );
        for ( ich = 0; ich < argv[0].len; ich++ ) {
            }
        }   /* end of char event processing */
    else {
        }
}                          /* end of input proc */

BOOL RegisterGSeries()
{
    PWNDCLASS   pGSeriesClass;

    pGSeriesClass = (PWNDCLASS) calloc( 1, sizeof( WNDCLASS ) );
    pGSeriesClass->lpClsName    = (LPSTR) "GSeries";

    pGSeriesClass->hClsItTable = ItLoad( hRF,(LPSTR)"graph" );
    pGSeriesClass->hClsCursor  = NULL;
    pGSeriesClass->hClsIconId  = NULL;

    pGSeriesClass->hBackBrush   = hbrWhite;

    pGSeriesClass->vUpdate       = REDRAW;
    pGSeriesClass->hUpdate       = REDRAW;

    pGSeriesClass->clsWndCreate  = GSeriesCreate;
    pGSeriesClass->clsWndInput   = GSeriesInput;
    pGSeriesClass->clsWndPaint   = GSeriesPaint;
    pGSeriesClass->clsWndDestroy = GSeriesDestroy;

    if (!RegisterClass( (LPWNDCLASS)pGSeriesClass ) )
        return FALSE;   /* Initialization failed */

    free( (char *) pGSeriesClass );

    return TRUE;    /* Initialization succeeded */
}

GSStartMvSt ( hGSeries )
HWND    hGSeries;
{
    rectImage = rectGSeries[ (int)GetProp( hGSeries, (LPSTR)"iGSeries" )];
    StartMvSt( hGSeries, hWwGraph, (LPPOINT)&ptPrev, (LPPOINT)&ptMouse,
        (LPRECT)&rectImage );
}

GSFinishMvSt ( hGSeries )
HWND    hGSeries;
{
    int     i = (int)GetProp( hGSeries, (LPSTR)"iGSeries" );
    RECT    rectOld;

    rectOld = rectGSeries[i];
    FinishMvSt( hGSeries, hWwGraph, (LPPOINT)&ptPrev, (LPPOINT)&ptMouse,
        (LPRECT)&rectImage, iState );
    rectGSeries[i] = rectImage;
    MoveChild( hGSeries, hWwGraph, rectGSeries[i].left, rectGSeries[i].top,
        rectGSeries[i].right  - rectGSeries[i].left,
        rectGSeries[i].bottom - rectGSeries[i].top, TRUE );
    Refresh( hWwGraph, (LPRECT)&rectOld, hGSeries );
}


GSeriesInitStatics()
{
    iState = SUP;
}
