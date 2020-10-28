
#include "windows.h"

/*  Sample Font Manipulation Module
    NOTE :   This application is based on the Template.c model application.
    I have removed most of the comments not directly related to working with
    Fonts.
*/
static int FontYCoord;      /* the y coordinate of the starting text */

static HBRUSH hbrWhite;
static HBRUSH hbrBlack;
static HBRUSH hbrGray;

    /* the two callback routines */
static FARPROC eafproc;
static FARPROC cbproc;

HANDLE      hRF;

typedef struct {
    HDC                 hDC;
    char                FAR *lpClientData;
    FARPROC             lpCallbackFunc;
    } EAFDataType;

EnumAllFonts(hDC, lpCallbackFunc, lpClientData)
HDC                 hDC;
FARPROC             lpCallbackFunc;
char                FAR *lpClientData;
{
    EAFDataType         EAFData;

    (EAFData.hDC) = hDC;
    (EAFData.lpClientData) = lpClientData;
    (EAFData.lpCallbackFunc) = lpCallbackFunc;

    return(EnumFonts(hDC,
                 (char FAR *)0,
                 eafproc,
                 (char FAR *)&EAFData));
}


short int FAR PASCAL
EAFCallback(lpLogFont, lpTextMetrics, FontType, lpEAFData)
LOGFONT             FAR *lpLogFont;
TEXTMETRIC          FAR *lpTextMetrics;
WORD                FontType;
EAFDataType         FAR *lpEAFData;

{
return(EnumFonts(lpEAFData->hDC,
                 (LPSTR)(lpLogFont->lfFaceName),
                 (lpEAFData->lpCallbackFunc),
                 (char FAR *)(lpEAFData->lpClientData)));
}


BOOL FAR PASCAL TemplateDestroy( hWindow, command, lpProc )
HWND    hWindow;                /* A handle to a window data structure   */
int     command;                /* either QUERYDESTROY or WINDOWDESTROY  */
FARPROC lpProc;                 /* proc to be called after user response */
{

}


int FAR PASCAL TemplatePaint( hWindow, hDc, eraseFlag, lpRectangle, lpHint )
HWND    hWindow;
HDC     hDc;
BOOL    eraseFlag;
LPRECT  lpRectangle;
LPINT   lpHint;
{
    /* Any time we repaint, reset the location                          */
    /* where the text will appear next to the top of the screen         */

    FontYCoord = 0;
}

/* Routine will textout a sample of each of the stock fonts */
ShowDefaults( hDC )
HDC hDC;
{   HFONT hFont;
    TEXTMETRIC tmLocalTM;

    hFont = GetStockObject( FIXED_FONT );
        /* associate the chosen font with the Device Context */
    SelectObject(hDC, hFont);
    TextOut( hDC,
             0, FontYCoord,
             (LPSTR)"This is the Fixed-pitch Stock Font",
             34 );
        /* Now figure out how much to increment ycoord for next line  */
    GetTextMetrics( hDC, (TEXTMETRIC FAR *)&tmLocalTM );

        /* True Height of a character is tmHeight + tmLeading.  Using this  */
        /* inter-line spacing will guarantee that lines won't overlap.      */
        /* by the way, tmHeight == tmAscent + tmDescent  */

    FontYCoord += tmLocalTM.tmHeight + tmLocalTM.tmLeading;
        /* Since we're done with the font, get rid of it  */
    DeleteObject( hFont );

    hFont = GetStockObject( VAR_FONT );
    SelectObject(hDC, hFont);
    TextOut( hDC,
             0, FontYCoord,
             (LPSTR)"This is the Variable-pitch Stock Font",
             37 );

    GetTextMetrics( hDC, (TEXTMETRIC FAR *)&tmLocalTM );
        /* skip a line in this font */
    FontYCoord += 2 * (tmLocalTM.tmHeight + tmLocalTM.tmLeading);

    TextOut( hDC,
             0, FontYCoord,
             (LPSTR)"Here are all the available fonts for this device:",
             49 );
    FontYCoord += tmLocalTM.tmHeight + tmLocalTM.tmLeading;
    DeleteObject( hFont );

}

/* note that since this routine is a callback routine that had  */
/* GetProcAddress called on it, it had to be declared as FAR and as  */
/* an EXPORT routine in the Def file [fddef.def] */

short int FAR PASCAL
cb(lpLogfont, lpTextMetrics, nFontType, lphDC)
LPLOGFONT    lpLogfont;
LPTEXTMETRIC lpTextMetrics;
WORD         nFontType;
HDC      FAR *lphDC;         /* long pointer to a DC handle */
{   HFONT hLocalFont;
    char  teststring[ LF_FACESIZE + 55 ]; /* size of face name + alphabet  */

    hLocalFont = CreateFontIndirect(lpLogfont);
    SelectObject((HDC)(*((unsigned short int far *)lphDC)),
                                         (HANDLE)hLocalFont );

        /* Put the facename into the output string  */
    lstrcpy((LPSTR)teststring, (LPSTR)lpLogfont->lfFaceName);
    lstrcat((LPSTR)teststring,
            (LPSTR)"  ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    TextOut( (HDC)(*((unsigned short int far *)lphDC)),
             0, FontYCoord,
             (LPSTR)teststring,
             (short)lstrlen((LPSTR)teststring));
        /* set up y location for next line of text */
    FontYCoord += lpTextMetrics->tmHeight + lpTextMetrics->tmLeading;
        /* blow away the memory allocated for the Font since we're */
        /* done with it */
    DeleteObject( hLocalFont );
}

/* A template Input procedure */
int FAR PASCAL TemplateInput( hWindow, argc, argv )
HWND    hWindow;                /* A handle to a window data structure  */
int     argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;          /* The results are of fixed size.       */
{
    int i;
    HDC hDC;
    HANDLE hFont;
    FARPROC myaddress;

    for (i=0; i<argc; i++)
        switch (argv[ i ].type) {

            case NUMCODE:
                /* argv[i].resval.numval.n is 16 bit integer */
             if (argv[i].resval.numval.n == 666) {
                        /* blow away the current contents of the window  */
                PaintWindow( hWindow, TRUE, (LPRECT)NULL, (LPINT)NULL );
                }
             else {
                hDC = GetDC(hWindow);
                ShowDefaults( hDC );
                    /* for each font available on this device, call the   */
                    /* function cb and pass it a pointer to my DC handle  */
                EnumAllFonts( hDC,
                              cbproc,
                              (HDC FAR *)&hDC);
                ReleaseDC( hWindow, hDC );
                }
                break;
            }
}


/* A template Size procedure */
int FAR PASCAL TemplateSize( hWindow, newWidth, newHeight )
HWND    hWindow;                /* A handle to a window data structure   */
int     newWidth;               /* The new width of the window instance  */
int     newHeight;              /* The new height of the window instance */
{
    /*  This is called whenever the window is changing size. */
}

int FAR PASCAL TemplateScroll( hWindow, scrollCommand, amount )
HWND    hWindow;
int     scrollCommand;
int     amount;
{
        return(0);
}


/* template Focus procedure */

int FAR PASCAL TemplateFocus( hWindow, event )
HWND    hWindow;
int     event;
{
}


/* template Data procedure */

int FAR PASCAL TemplateData( hWindow, command, format, hINdata, lphOUTdata )
HWND    hWindow;
int     command;
int     format;
HANDLE  hINdata;
LPHANDLE lphOUTdata;
{
    /* This procedures implements data interchange protocals for this
       window class.
     */
}


TemplateInit()
{

    HMENU       hmenu, hMDmenu;
    PWNDCLASS   pTemplateClass;

        /* Setup some default brushes */
    hbrWhite = GetStockObject( WHITE_BRUSH );
    hbrBlack = GetStockObject( BLACK_BRUSH );
    hbrGray  = GetStockObject( GRAY_BRUSH );

        /* Allocate class structure in local heap */
    pTemplateClass = (PWNDCLASS)LocalAlloc( LPTR, sizeof(WNDCLASS) );

        /* Open a resource file */
    if (hRF = OpenResourceFile((LPSTR)"Fontdemo.res")) {
        pTemplateClass->hClsItTable = ItLoad( hRF, (LPSTR)"fontdemo" );
        pTemplateClass->hClsCursor  = CursorLoad( hRF, (LPSTR)"fontdemo" );
        pTemplateClass->hClsIconId  = IconLoad( hRF,(LPSTR)"fontdemo" );

            /* note this is different from Template.c */
        pTemplateClass->hMenu       = MenuLoad( hRF, (LPSTR)"fontdemo" );
        }

    pTemplateClass->lpClsName    = (LPSTR) "FontDemo";
    pTemplateClass->hBackBrush   = (HBRUSH) hbrWhite;
       /* The class chooses to have its origin in the top left of a window. */
    pTemplateClass->vOrigin       = TOP;
    pTemplateClass->hOrigin       = LEFT;

        /* The class choose to always redraw its contents whenever the window
           is sized */
    pTemplateClass->vUpdate       = REDRAW;
    pTemplateClass->hUpdate       = REDRAW;

       /* Fill in the names of our class procedures.  Each procedure must have
           been declared as a FAR procedure and listed in the EXPORTS section
           of this modules .DEF file.
         */

    pTemplateClass->clsWndDestroy = TemplateDestroy;
    pTemplateClass->clsWndPaint   = TemplatePaint;
    pTemplateClass->clsWndSize    = TemplateSize;
    pTemplateClass->clsWndScroll  = TemplateScroll;
    pTemplateClass->clsWndInput   = TemplateInput;
    pTemplateClass->clsWndFocus   = TemplateFocus;
    pTemplateClass->clsWndData    = TemplateData;

        /* register this new class with WINDOWS */
    if (!RegisterClass( (LPWNDCLASS)pTemplateClass ) )
        return FALSE;   /* Initialization failed */

    Free( (HANDLE)pTemplateClass );

    return TRUE;    /* Initialization succeeded */
}


int FAR PASCAL TemplateLoad( hInstance, hPrev, lpParms )
HANDLE hInstance;
HANDLE hPrev;
LPNEWPARMS lpParms;
{

    if (!hPrev){
        if ( !TemplateInit() )
            return( FALSE );
        }
    else {
        GetInstanceData( hPrev, (PSTR)&hbrWhite, sizeof( hbrWhite ) );
        GetInstanceData( hPrev, (PSTR)&hbrBlack, sizeof( hbrBlack ) );
        GetInstanceData( hPrev, (PSTR)&hbrGray,  sizeof( hbrGray ) );
    }
        FontYCoord = 0;

        /* Create a window instance of class "fontdemo" */
    lpParms->hWnd = CreateWindow(
        (LPSTR) "FontDemo",
        (LPSTR) "Sample Font Application",
        FALSE,
        FALSE,
        FALSE,
        NULL,
        100,
        0,
        hInstance
        );
    eafproc = MakeProcInstance((FARPROC)EAFCallback, hInstance );
    cbproc = MakeProcInstance( (FARPROC)cb, hInstance );
}


/* note closing the resource file if this is the last instance... */

void FAR PASCAL TemplateFree( hInstance, bLastInstance )
HANDLE hInstance;
BOOL bLastInstance;
{
    if (bLastInstance)
        CloseResourceFile( hRF );
}
