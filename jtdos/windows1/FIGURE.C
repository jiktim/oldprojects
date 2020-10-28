/* figure.c */

#include    "windows.h"
#include    "events.h"
#include    "menu.h"
#include    "graph.h"

#define WHOFIGURE   0
#define WHOWINDOW   1

extern  HBRUSH  hbrGray;
extern  HBRUSH  hbrBlack;
extern  HBRUSH  hbrWhite;
extern  HPEN    hpenBlack;

extern  HANDLE  hRF;
extern  HWND    hWwGraph;
extern  HWND    hTopChild;

/* Debug aids */
extern  HWND    hCtlMsg[];
extern  BOOL    fChkBox[];
extern  BOOL    fPshBtn[];
extern  int     iRadBtn;
static  int     iNextCtlMsg = 0;

HWND    hFigure;                /* this window instance */
int     modeSize = IDMSCALE;    /* CLIP or SCALE */
int     cItems = 3;             /* number of items in figure */
int     gallery = COLUMN;       /* BAR COLUMN */
RECT    rectFigWin;             /* fig window in parent coord */

HCURSOR     hCursorTB;
HCURSOR     hCursorLR;
HCURSOR     hCursorBLUR;
HCURSOR     hCursorTLBR;
HCURSOR     hCursorMOVE;
HCURSOR     hCursorBOX;
HCURSOR     hCursorCur;

HCURSOR      hCursor[BRIGHT+1];
static POINT        ptMouse;
static POINT        ptPrev;
static int          iState = SUP;
static RECT         rectImage;
static RECT         rectFigWinSelf; /* rect of figure window in self   coord */
static int          iWho;   /* FIGURE => move stretch figure, else window */
static HWND         hWwImage;   /* parent or self during Move/stretch */

RECT    rectFig;    /* rect defining current bounds of figure */
RECT    rectClip;   /* rect if IDMCLIP */

int FAR PASCAL FigureCreate( hWindow )
HWND    hWindow;                /* A handle to a window data structure */
{
    SetRect( (LPRECT)&rectFigWinSelf, 0, 0,
        rectFigWin.right - rectFigWin.left,
        rectFigWin.bottom - rectFigWin.top );
    SetRect( (LPRECT)&rectClip, rectFigWinSelf.right/8, rectFigWinSelf.bottom/8,
        rectFigWinSelf.right*7/8, rectFigWinSelf.bottom*7/8 );
    modeSize = IDMSCALE;
    cItems = 3;
    gallery = COLUMN;
}

int FAR PASCAL FigurePaint( hWindow, hDC, eraseFlag, lpRectangle, pHint )
HWND    hWindow;                /* a handle to a window data structure */
HDC     hDC;                    /* a handle to a GDI display context */
BOOL    eraseFlag;              /* a flag telling whether the background has been erased */
LPRECT  lpRectangle;            /* a long pointer to a rectangle data structure indicating the minimum area which MUST be repainted */
LPINT   pHint;                 /* a long pointer to a client or window manager supplied hint */
{
    int     cXInc, cYInc;
    int     xLeft, xRight, yTop, yBottom;
    int     xExt, yExt;
    int     i;

    if ( iRadBtn == 1 && IsCtlVisible( hCtlMsg[0] ) )
        SetCtlInt( hCtlMsg[0], lpRectangle->top );
    if ( iRadBtn == 1 && IsCtlVisible( hCtlMsg[1] ) )
        SetCtlInt( hCtlMsg[1], lpRectangle->left );
    if ( iRadBtn == 1 && IsCtlVisible( hCtlMsg[2] ) )
        SetCtlInt( hCtlMsg[2], lpRectangle->bottom );
    if ( iRadBtn == 1 && IsCtlVisible( hCtlMsg[3] ) )
        SetCtlInt( hCtlMsg[3], lpRectangle->right );

    if ( modeSize == IDMCLIP ) {
        rectFig = rectClip;
        }
    else /* SCALE */
        {
        int     Tx, Ty;
        RECT    lpSize;

        GetClientRect( hWindow, (LPRECT)&lpSize );
        Tx = lpSize.right - lpSize.left;
        Ty = lpSize.bottom - lpSize.top;
        SetRect( (LPRECT)&rectFig, Tx/8, Ty/8, 7*Tx/8, 7*Ty/8 );
        }
    SelectObject( hDC, hbrGray );
    SelectObject( hDC, hpenBlack );
    xExt = rectFig.right - rectFig.left;
    yExt = rectFig.bottom - rectFig.top;
    cItems = ( cItems < 1 ? 1 : cItems );
    switch (gallery) {
        case IDMBAR:
            MoveTo( hDC, rectFig.left, rectFig.top     );
            LineTo( hDC, rectFig.left, rectFig.bottom  );
            LineTo( hDC, rectFig.right, rectFig.bottom );
            cXInc = cItems + 1;
            cYInc = 3 * cItems + 1;
            for ( i = 0; i < cItems; i++ ) {
                yTop    = rectFig.bottom -
                            (LONG)(3*i + 3) * (LONG)yExt / (LONG)cYInc;
                yBottom = rectFig.bottom -
                            (LONG)(3*i + 1) * (LONG)yExt / (LONG)cYInc;
                xRight  = rectFig.left +
                            (LONG)(i + 1) * (LONG)xExt / (LONG)cXInc;
                xLeft   = rectFig.left;
                if ( yTop    <  rectFig.top    ) yTop    = rectFig.top;
                if ( yTop    >= rectFig.bottom ) yTop    = rectFig.bottom - 1;
                if ( yBottom <= yTop          ) yBottom = yTop + 1;
                if ( xRight  >  rectFig.right ) xRight  = rectFig.right;
                Rectangle( hDC, xLeft, yTop, xRight, yBottom );
                }
            break;
        case IDMCOLUMN:
        default:
            MoveTo( hDC, rectFig.left , rectFig.top    );
            LineTo( hDC, rectFig.left , rectFig.bottom );
            LineTo( hDC, rectFig.right, rectFig.bottom );
            cXInc = 3 * cItems  + 1;
            cYInc = cItems + 1;
            for ( i = 0; i < cItems; i++ ) {
                xLeft   = rectFig.left +
                            (LONG)(3 * i + 1) * (LONG)xExt / (LONG)cXInc;
                xRight  = rectFig.left +
                            (LONG)(LONG)(3 * i + 3) * (LONG)xExt / (LONG)cXInc;
                yTop    = rectFig.bottom -
                            (LONG)(i + 1) * (LONG)yExt / (LONG)cYInc;
                yBottom = rectFig.bottom;
                if ( xLeft  >= rectFig.right ) xLeft  = rectFig.right - 1;
                if ( xRight <= xLeft         ) xRight = xLeft + 1;
                if ( yTop   <= rectFig.top   ) yTop   = rectFig.top;
                Rectangle( hDC, xLeft, yTop, xRight, yBottom );
                }
        }
}                               /* end paint proc */

int FAR PASCAL FigureInput(hWindow, argc, argv)
HWND        hWindow;                /* A handle to a window data structure  */
int         argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;              /* A list of result "BRIGHT hand sides"  */
{                               /* The results are of fixed size.       */

    if ( argc == 2 && argv[1].type == MSCRDCODE ) {
        int evt;
        int iWhere;
        LPRECT  lprect;

        evt = argv[0].resval.numval.n;
        ptMouse.x = argv[1].resval.mouseval.x;
        ptMouse.y = argv[1].resval.mouseval.y;

        if ( iRadBtn == 4 && IsCtlVisible( hCtlMsg[iNextCtlMsg] ))   {
            SetCtlInt( hCtlMsg[iNextCtlMsg++], evt );
            if ( iNextCtlMsg == MAXCTLMSG ) iNextCtlMsg = 0;
            }

        switch (evt & EVTGRBFCN) { /* mask off shift ctl */
            case EVTB1DN:
            case EVTB2DN:

                if ( evt & EVTBITCTL || ( (evt & EVTGRBFCN) == EVTB2DN ) ) {
                    iWho = WHOWINDOW;
                    lprect = (LPRECT)&rectFigWinSelf;
                    }
                else {
                    iWho = WHOFIGURE;
                    lprect = (LPRECT)&rectFig;
                    }

                if ( hTopChild != hFigure )
                    BringChildToTop( hTopChild = hFigure );

                if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[0] ) )
                    SetCtlInt( hCtlMsg[0], evt );

                switch (iWhere = Where((LPPOINT)&ptMouse, (LPRECT)lprect, 15)) {
                    case BINSIDE:
                    case BOUTSIDE:
                        iState = SMV;
                        break;
                    default:
                        iState = iWhere;    /* depends on order of B* S* */
                        break;
                    };
                FigStartMvSt();
                break;
            case EVTB1UP:
            case EVTB2UP:
                if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[1] ) )
                    SetCtlInt( hCtlMsg[1], evt );
                switch ( iState ) {
                    case SUP:
                        break;
                    default:
                        FigFinishMvSt();
                        break;
                    };
                iState = SUP;
                SetFocus( hFigure, (HANDLE)NULL, (FARPROC)NULL );
                break;
            case EVTMSMOVE:

                if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[2] ) )
                    SetCtlInt( hCtlMsg[2], evt );

                switch ( iState ) {
                    case SUP:
                        lprect = ( evt & EVTBITCTL  ? (LPRECT)&rectFigWinSelf :
                                                       (LPRECT)&rectFig) ;
                        SetCursor( hCursor[
                            Where( (LPPOINT)&ptMouse, (LPRECT)lprect, 15) ] );
                        break;
                    default:
                        ContinueMvSt( hWwImage, (LPPOINT)&ptPrev,
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

        if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[3] ) )
            SetCtlInt( hCtlMsg[3], argv[0].len );

        lpstr = (argv[0].type == CHARCODE ? (LPSTR)argv[0].resval.charval.c :
                (LPSTR)argv[0].resval.strval.pStr );
        for ( ich = 0; ich < argv[0].len; ich++ ) {

            if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[4] ) )
                SetCtlInt( hCtlMsg[4], (int)*lpstr );

            switch ( ch = *lpstr++ ) {
                case '+':
                case '-':
                    if ( ch == '+' ) cItems ++;
                    else cItems--;
                    fRedraw++;
                    break;
                default:
                    break;
                }
            };
        if ( fRedraw ) RedrawFigure( hFigure );
        }   /* end of char event processing */
    else {
        if ( iRadBtn == 0 && IsCtlVisible( hCtlMsg[3] ) )
            SetCtlInt( hCtlMsg[3], argv[0].type );
        }
}                          /* end of input proc */

BOOL RegisterFigure()
{
    PWNDCLASS   pFigureClass;

    pFigureClass = (PWNDCLASS) calloc( 1, sizeof( WNDCLASS ) );
    pFigureClass->lpClsName    = (LPSTR) "Figure";

    pFigureClass->hClsItTable = ItLoad( hRF,(LPSTR)"graph" );

    hCursorTB     = CursorLoad( hRF, (LPSTR)"tb"    );
    hCursorLR     = CursorLoad( hRF, (LPSTR)"lr"    );
    hCursorBLUR   = CursorLoad( hRF, (LPSTR)"blur"  );
    hCursorTLBR   = CursorLoad( hRF, (LPSTR)"tlbr"  );
    hCursorMOVE   = CursorLoad( hRF, (LPSTR)"move"  );
    hCursorBOX    = CursorLoad( hRF, (LPSTR)"box"   );

    hCursor[ BINSIDE  ] = hCursorMOVE ;
    hCursor[ BOUTSIDE ] = hCursorMOVE ;
    hCursor[ BTOP     ] = hCursorTB   ;
    hCursor[ BBOTTOM  ] = hCursorTB   ;
    hCursor[ BLEFT    ] = hCursorLR   ;
    hCursor[ BRIGHT   ] = hCursorLR   ;

    pFigureClass->hClsCursor  = NULL;
    pFigureClass->hClsIconId  = NULL;

    pFigureClass->hBackBrush   = hbrWhite;

    pFigureClass->vUpdate       = REDRAW;
    pFigureClass->hUpdate       = REDRAW;

    pFigureClass->clsWndCreate  = FigureCreate;
    pFigureClass->clsWndInput   = FigureInput;
    pFigureClass->clsWndPaint   = FigurePaint;

    if (!RegisterClass( (LPWNDCLASS)pFigureClass ) )
        return FALSE;   /* Initialization failed */

    free( (char *) pFigureClass );

    return TRUE;    /* Initialization succeeded */
}

RedrawFigure( hWindow )
HWND    hWindow;
{
    PaintWindow( hWindow, TRUE, (LPRECT)NULL, (LPINT)NULL );
}

int Where( lppt, lprect, iMargin)
LPPOINT  lppt;
LPRECT   lprect;
int     iMargin;
{
    int xLM = lprect->left   - iMargin;
    int xLP = lprect->left   + iMargin;
    int xRM = lprect->right  - iMargin;
    int xRP = lprect->right  + iMargin;
    int yTM = lprect->top    - iMargin;
    int yTP = lprect->top    + iMargin;
    int yBM = lprect->bottom - iMargin;
    int yBP = lprect->bottom + iMargin;
    int x = lppt->x;
    int y = lppt->y;

    if ( x <  xLM || x >= xRP ||
         y <  yTM || y >= yBP    ) return BOUTSIDE;
    if ( x >= xLM && x <  xLP    ) return BLEFT   ;
    if ( x >= xRM && x <  xRP    ) return BRIGHT  ;
    if ( y >= yTM && y <  yTP    ) return BTOP    ;
    if ( y >= yBM && y <  yBP    ) return BBOTTOM ;
    return BINSIDE;
}

FigStartMvSt ()
/* Start Move Stretch with implicit input parameters:
    ptMouse - mouse button down position
    rectFig - current rect for figure
    rectWindow - current rect for window
    iWho - move stretch figure or window
output:
    ptPrev = ptMouse
    rectImage = rectFig or rectWindow
*/
{

    if ( iWho == WHOFIGURE ) {
        rectImage = rectFig;
        hWwImage = hFigure;
        modeSize = IDMCLIP;
        CheckMenu( hWwGraph, SIZE, CLIP,  TRUE  );
        CheckMenu( hWwGraph, SIZE, SCALE, FALSE );
        }
    else {
        rectImage = rectFigWin;
        hWwImage = hWwGraph;
        }
    StartMvSt( hFigure, hWwImage, (LPPOINT)&ptPrev, (LPPOINT)&ptMouse,
        (LPRECT)&rectImage );
}

FigFinishMvSt ()
/* Finish Move Stretch
    input:
    output:
*/
{
    FinishMvSt( hFigure, hWwImage, (LPPOINT)&ptPrev, (LPPOINT)&ptMouse,
        (LPRECT)&rectImage, iState );
    if ( iWho == WHOFIGURE ) {
        if ( rectClip.top    != rectImage.top    ||
             rectClip.bottom != rectImage.bottom ||
             rectClip.left   != rectImage.left   ||
             rectClip.right  != rectImage.right     ) {
            rectClip = rectImage;
            RedrawFigure( hFigure );
            };
        }
    else {
        /* rectFinWin is parent coord of fig window, so use old left, top
           to xlate image in fig coord to new fig window in parent coord */
        RECT    rectOld;

        rectOld = rectFigWin;
        rectFigWin = rectImage;
        SetRect( (LPRECT)&rectFigWinSelf, 0, 0,
            rectFigWin.right  - rectFigWin.left,
            rectFigWin.bottom - rectFigWin.top );
        MoveChild( hFigure, hWwGraph, rectFigWin.left, rectFigWin.top,
            rectFigWin.right  - rectFigWin.left,
            rectFigWin.bottom - rectFigWin.top, TRUE );
        Refresh( hWwGraph, (LPRECT)&rectOld, hFigure );
        };
}


FinishMvSt( hWw, hWwImage, lpptOld, lpptNew, lprect, iState )
HWND    hWw, hWwImage;
LPPOINT lpptOld, lpptNew;
LPRECT  lprect;
int     iState;
{
    ContinueMvSt( hWwImage, (LPPOINT)lpptOld, (LPPOINT)lpptNew, (LPRECT)lprect,
        iState);     /* final update */
    ShowImage( hWwImage, (LPRECT)lprect );        /* pickup */
    ReleaseCapture();
}

StartMvSt( hWw, hWwImage, lpptOld, lpptNew, lprect )
HWND    hWw, hWwImage;
LPPOINT lpptOld, lpptNew;
LPRECT  lprect;
/* generic Start Move Stretch */
{
    SetCapture( hWw, (HANDLE)NULL, (LPHANDLE)NULL );
    ShowImage( hWwImage, (LPRECT)lprect );
    *lpptOld = *lpptNew;
}

ContinueMvSt( hWwImage, lpptOld, lpptNew, lprect, iState )
HWND    hWwImage;
LPPOINT lpptOld, lpptNew;
LPRECT  lprect;
int     iState;
{
    ShowImage( hWwImage, (LPRECT)lprect ); /* pick it up */
    AdjustImage( (LPPOINT)lpptOld, (LPPOINT)lpptNew, (LPRECT)lprect, iState);
    ShowImage( hWwImage, (LPRECT)lprect ); /* put it down */
    *lpptOld = *lpptNew;
}

ShowImage( hWw, lprect )
HWND    hWw;
LPRECT  lprect;
{
    HDC     hDC;
    int     xExt = lprect->right - lprect->left;
    int     yExt = lprect->bottom - lprect->top;

    /*
    if ( iWho == WHOFIGURE ) {
        hWindow = hFigure;
        rect = rectImage;
        }
    else {
        hWindow = hWwGraph;
        SetRect( (LPRECT)&rect,
            rectImage.left   + rectFigWin.left,
            rectImage.top    + rectFigWin.top ,
            rectImage.right  + rectFigWin.left,
            rectImage.bottom + rectFigWin.top   );
        }
    */

    hDC = GetDC( hWw );
    SelectObject( hDC, hbrBlack );
    PatBlt( hDC, lprect->left , lprect->top   , 1, yExt, DSTINVERT );
    PatBlt( hDC, lprect->right, lprect->top   , 1, yExt, DSTINVERT );
    PatBlt( hDC, lprect->left , lprect->top   , xExt, 1, DSTINVERT );
    PatBlt( hDC, lprect->left , lprect->bottom, xExt, 1, DSTINVERT );
    ReleaseDC( hWw, hDC );
}

AdjustImage( lpptOld, lpptNew, lprect, iState )
LPPOINT lpptOld, lpptNew;
LPRECT  lprect;
int     iState;
{
    int     xChng = lpptNew->x - lpptOld->x;
    int     yChng = lpptNew->y - lpptOld->y;

    switch ( iState ) {
        case SMV:
            lprect->left   += xChng;
            lprect->right  += xChng;
            lprect->top    += yChng;
            lprect->bottom += yChng;
            break;
        case SSTTOP:
            lprect->top = min( lprect->top + yChng, lprect->bottom - 1);
            break;
        case SSTBOTTOM:
            lprect->bottom = max( lprect->top + 1, lprect->bottom + yChng );
            break;
        case SSTLEFT:
            lprect->left = min( lprect->left + xChng, lprect->right - 1);
            break;
        case SSTRIGHT:
            lprect->right = max( lprect->left + 1, lprect->right + xChng );
            break;
        default:
            break;
        };
}

HWND CreatePBCtl( hParent, id, x, y, cx, cy )
HWND    hParent;
int     id, x, y, cx, cy ;
{
    CTLDEF  ctd;
    HDC     hdc;

    ctd.lpszClass = (LPSTR)"Button";
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


FigureInitStatics()
{
    iNextCtlMsg = 0;
    modeSize = IDMSCALE;
    cItems = 3;
    gallery = COLUMN;
    iState = SUP;
}
