#include    "windows.h"

extern FAR SampleInit();

HBRUSH   hbrWhite;
HBRUSH   hbrBlack;
HBRUSH   hbrGray;

#define XCOUNT      4
#define YCOUNT      4
#define CHARWIDTH   8
#define CHARHEIGHT  8
#define TXMIN       ((CHARWIDTH*2 + 1)*(XCOUNT + 1) + 1)
#define TYMIN       ((CHARHEIGHT + 1)*(YCOUNT + 1) + 1)
#define MOUSEDN     1

static int     xExt;
static int     yExt;
static int     Bx;
static int     By;
static int     MTi;
static int     MTj;
static int     MTx;
static int     MTy;
static int     grey;
static int     A[XCOUNT][YCOUNT];

int FAR PASCAL SampleCreate( hWindow )
HWND    hWindow;                /* A handle to a window data structure */
{
    int     i, j;

    MTi = XCOUNT - 1;
    MTj = YCOUNT - 1;
    for (i = 0; i < XCOUNT; i++)
        for (j = 0; j < YCOUNT; j++)
            A[j][i] = 1 + i * XCOUNT + j;
}


int FAR PASCAL SamplePaint( hWindow, hDC, eraseFlag, lpRectangle, pHint )
HWND    hWindow;                /* a handle to a window data structure */
HDC     hDC;                    /* a handle to a GDI display context */
BOOL    eraseFlag;              /* a flag telling whether the background has been erased */
LPRECT  lpRectangle;            /* a long pointer to a rectangle data structure indicating the minimim area which MUST be repainted */
LPINT   pHint;                 /* a long pointer to a client or window manager supplied hint */
{
    int     i, j, len;
    int     Tx, Ty,                     /* Total size of available window */
            xLineExt, yLineExt;         /* length of lines across the sample */
    RECT    Size;
    RECT    lpSize;
    BYTE    strBuf[4];

        /* since it is easy to resize we'll do it on every repaint */
    GetClientRect( hWindow, (LPRECT)&lpSize );
    Tx = lpSize.right - lpSize.left;
    Ty = lpSize.bottom - lpSize.top;

        /* Don't go below minimum size */
    if (Tx < TXMIN) Tx = TXMIN;
    if (Ty < TYMIN) Ty = TYMIN;

        /* define constants */
    xExt = Tx/(XCOUNT + 1);
    yExt = Ty/(YCOUNT + 1);
    Bx   = xExt/2;
    By   = yExt/2;
    MTx  = Bx + MTi * xExt;
    MTy  = By + MTj * yExt;
    xLineExt = XCOUNT * xExt;
    yLineExt = YCOUNT * yExt;

        /* background painted by windows */
        /* paint the lines */
    for (i = Bx; i <= Bx + xLineExt; i += xExt) {
        SelectObject( hDC, hbrBlack );
        PatBlt( hDC, i, By, 1, yLineExt, PATCOPY );
        }

    for (i = By; i <= By + yLineExt; i += yExt)
        PatBlt( hDC, Bx, i, xLineExt, 1, PATCOPY );


        /* put in the numbers */
    for (i = 0; i < XCOUNT; i++)
        for (j = 0; j < YCOUNT; j++) {
            len = stcu_d( (LPSTR)strBuf, A[i][j], 4 );
            TextOut( hDC, Bx + i*xExt + xExt/2 - CHARWIDTH, By + j*yExt + yExt/2 - CHARHEIGHT/2, (LPSTR)strBuf, len );
            }

        /* grey out the empty slot */
    SelectObject( hDC, hbrGray );
    PatBlt( hDC, MTx+1, MTy+1, xExt-1, yExt-1, PATCOPY );
}                               /* end paint proc */



int FAR PASCAL SampleInput(hWindow, argc, argv)
HWND        hWindow;                /* A handle to a window data structure  */
int         argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;              /* A list of result "right hand sides"  */
{                               /* The results are of fixed size.       */
    int     Si, Sj,             /* cell index of event */
            Sx, Sy;             /* cell address of event */
    HANDLE      hDC;

    if ( argc == 1 && argv[0].type == MSCRDCODE ) {
        hDC = GetDC( hWindow );

        Sx = argv[0].resval.mouseval.x;
        Sy = argv[0].resval.mouseval.y;

            /* reduce event to a box index */
        Si = (Sx - Bx)/xExt;
        Sj = (Sy - By)/yExt;

            /* insure that click is in a valid area */
        if ( (Si >= 0) && (Si < XCOUNT)  &&
             (Sj >= 0) && (Sj < YCOUNT)
        ) {
                /* convert box index to upper left coordinates */
            Sx = Si*xExt + Bx;
            Sy = Sj*yExt + By;

                /* insure that click is in a box adjacent to the empty box */
            if ( ((MTi == Si) && (((MTj + 1) == Sj) ||
                 ((MTj - 1) == Sj))) ||
                 ((MTj == Sj) && (((MTi + 1) == Si) || ((MTi - 1) == Si)))
            ) {
                    /* move the numbered box into the empty slot */
                A[MTi][MTj] = A[Si][Sj];
                BitBlt( hDC, MTx, MTy, xExt, yExt, hDC, Sx, Sy, SRCCOPY );

                    /* grey out the empty slot */
                MTi = Si;
                MTj = Sj;
                MTx = Sx;
                MTy = Sy;

                SelectObject( hDC, hbrGray );
                PatBlt( hDC, MTx+1, MTy+1, xExt-1, yExt-1, PATCOPY );

                }                  /* endif adjacent */
            }

        ReleaseDC(hWindow, hDC);
        }
}                          /* end of input proc */


stcu_d( pBuf, val, len )
LPSTR pBuf;
int val,len;
{
    if (val/10)
        *pBuf++ = (val/10) + '0';
    *pBuf++ = (val%10) + '0';
    *pBuf++ = ' ';
    *pBuf++ = ' ';

    return ((val >= 10) ? 2 : 1);
}


BOOL FAR PASCAL SampleLoad( hInstance, hPrev, lpParms )
HANDLE hInstance, hPrev;
LPNEWPARMS lpParms;
{
    if (!hPrev) {
        if (!SampleInit())
            return FALSE;
        }
    else {
            /* Copy global instance variables from previous instance */
        GetInstanceData( hPrev, (PSTR)&hbrWhite, sizeof( hbrWhite ) );
        GetInstanceData( hPrev, (PSTR)&hbrBlack, sizeof( hbrBlack ) );
        GetInstanceData( hPrev, (PSTR)&hbrGray,  sizeof( hbrGray ) );
        }

        /* Create a window instance of class "Sample" */
    lpParms->hWnd = CreateWindow(
        (LPSTR) "Sample",   /* The class name */
        (LPSTR) "Sample",   /* The window instance name */
        TRUE,               /* A flag requesting the window be created as an icon */
        FALSE,              /* A Flag requesting a vertical scroll bar */
        FALSE,              /* A Flag requesting a horizontical scroll bar */
        NULL,               /* The window instance will be created with the class default menu */
        100,                /* A desired height of one hundred screen pixels */
        0,                  /* The window wants to be opened in column zero */
        hInstance
        );

    return TRUE;
}
