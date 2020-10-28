#include "windows.h"

/* This is a sample template for a WINDOWS application program.
   It illustrates the building of a class record, the registering of
   that class record with WINDOWS, and the creation of window instances
   of that class.  See TEMPLATE.DEF for the associated module definition file.
 */

/* The following three variables are initialized once when the application
   is first loaded and then copied into each succeeding instance, using
   GetInstanceData procedure
 */
static HBRUSH hbrWhite;
static HBRUSH hbrBlack;
static HBRUSH hbrGray;

/* Procedures which make up the window class.
   The most important procedures are Paint and Input.
 */

/* A template Create procedure */

int FAR PASCAL TemplateCreate( hWindow )
HWND    hWindow;                /* A handle to a window data structure */
{
    /* This routine is called just after creation of the window instance.
       This is a good time to allocate needed resources. Data can be
       allocated using the WINDOWS memory manager.
     */
}


/* A template Destroy procedure */

BOOL FAR PASCAL TemplateDestroy( hWindow, command, lpProc )
HWND    hWindow;                /* A handle to a window data structure   */
int     command;                /* either QUERYDESTROY or WINDOWDESTROY  */
FARPROC lpProc;                 /* proc to be called after user response */
{

    if (command==QUERYDESTROY) {
        return TRUE;            /* O.K. to destroy window                */
        /* if user confirmation is required then save lpProc, post a     *
         * dialog box, and return FALSE.  Later, when confirmation has   *
         * been recieved lpProc should be called and this branch should  *
         * return TRUE.                                                  */
         }
    else if (command==WINDOWDESTROY) {
        /* This is called just before the removal of a window instance
           from the system (a good time to free resources).
         */
        }
    else {
        /* error */
        }
}


/* A template Icon procedure */

int FAR PASCAL TemplateIcon( hWindow, bIconic )
HWND    hWindow;    /* A handle to a window data structure */
int     bIconic;    /* Either WINDOWOPEN or WINDOWCLOSE */
{
    /* This routine is called when a window is changed from being visible
       (open) to being closed (iconic) or when a window is being changed
       from being iconic to being visible.  This procedure is call just
       before the window is painted.
     */
    if (bIconic == WINDOWOPEN) {
        /* Window is being changed from closed to visible */
        }
    else
    if (bIconic == WINDOWCLOSE) {
        /* Window is being changed from visible to iconic */
        }
}


/* A template Paint procedure */

int FAR PASCAL TemplatePaint( hWindow, hDc, eraseFlag, lpRectangle, lpHint )
HWND    hWindow;                /* a handle to a window data structure */
HDC     hDc;                    /* a handle to a GDI display context */
BOOL    eraseFlag;              /* a flag telling whether the background has been erased */
LPRECT  lpRectangle;            /* a long pointer to a rectangle data structure indicating the minimum area which MUST be repainted */
LPINT   lpHint;                 /* a long pointer to a client or window manager supplied hint */
{
    if (!lpHint) {
        /* This is a window manager hint indicating the application
           must repaint its window. Note that the application must
           always be prepared to do this.
         */
        }
    else {
        /* This is a client supplied hint used for incremental updates */
        }
}


/* A template Input procedure */

int FAR PASCAL TemplateInput( hWindow, argc, argv )
HWND    hWindow;                /* A handle to a window data structure  */
int     argc;                   /* The number of results                */
RESULTBLOCK FAR *argv;          /* The results are of fixed size.       */
{
    int i;

    for (i=0; i<argc; i++)
        switch (argv[ i ].type) {
            case MSCRDCODE:
                /* argv[i].resval.mouseval.x is X coordinate */
                /* argv[i].resval.mouseval.y is Y coordinate */
                break;

            case TIMECODE:
                /* argv[i].resval.timeval.time is 32 bit time */
                break;

            case KEYSTCODE:
                /* argv[i].resval.stateval.pState is far pointer to state */
                break;

            case NUMCODE:
                /* argv[i].resval.numval.n is 16 bit integer */
                break;

            case CHARCODE:
                /* argv[i].resval.charval.c[0] 8 bit character code */
                break;

            case STRCODE:
                /* argv[i].resval.strval.pStr is far pointer to string */
                /* argv[i].len is the length of the string */
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


/* template Scroll procedure */

int FAR PASCAL TemplateScroll( hWindow, scrollCommand, amount )
HWND    hWindow;
int     scrollCommand;
int     amount;
{
    /* This procedure is called in order to implement both horizontal and
       vertical scroll bars.  There are two types of operations:  scroll
       command and information queries.
     */
    switch (scrollCommand) {
        case LINEUP:
            break;

        case LINEDOWN:
            break;

        case PAGEUP:
            break;

        case PAGEDOWN:
            break;

        case LINELEFT:
            break;

        case LINERIGHT:
            break;

        case PAGELEFT:
            break;

        case PAGERIGHT:
            break;

        case VERTICALPOSITION:
            break;

        case HORIZONTALPOSITION:
            break;

        case TOPPERCENTAGE:
            break;

        case LEFTPERCENTAGE:
            break;
        }
        return(0);
}


/* template Focus procedure */

int FAR PASCAL TemplateFocus( hWindow, event )
HWND    hWindow;
int     event;
{
    /* This procedure is called when a window acquires or loses the current
       input focus.  The current input focus is the target for keyboard
       events.  When a window acquires the focus it should display some
       indication, such as a blinking cursor.  When it loses the focus
       it should take down the indication.
     */
    switch (event) {
        case SETFOCUS:
            /* Window is acquiring the focus */
            break;

        case KILLFOCUS:
            /* Window is losing the focus */
            break;

        case PUSHFOCUS:
            /* Window is temporarily losing the focus */
            /* It should save its current selection */
            break;

        case POPFOCUS:
            /* Window is re-acquiring the focus */
            /* It should restore its current selection */
            break;
        }
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


/* Procedure called every time a new instance of the application
   is created
 */

BOOL FAR PASCAL TemplateLoad( hInstance, hPrev, lpParms )
HANDLE hInstance, hPrev;
LPNEWPARMS lpParms;
{
    if (!hPrev) {
        if (!TemplateInit())
            return FALSE;
        }
    else {
            /* Copy global instance variables from previous instance */
        GetInstanceData( hPrev, (PSTR)&hbrWhite, sizeof( hbrWhite ) );
        GetInstanceData( hPrev, (PSTR)&hbrBlack, sizeof( hbrBlack ) );
        GetInstanceData( hPrev, (PSTR)&hbrGray,  sizeof( hbrGray ) );
        }

        /* Create a window instance of class "Template" */
    lpParms->hWnd = CreateWindow(
        (LPSTR) "Template",               /* The class name */
        (LPSTR) "Template Application",   /* The window instance name */
        TRUE,                             /* A flag requesting the window be created iconic */
        TRUE,                             /* A Flag requesting a horizontal scroll bar */
        TRUE,                             /* A Flag requesting a vertical scroll bar */
        NULL,                             /* The window instance will be created with the class default menu */
        100,                              /* A desired height of one hundred screen pixels */
        0,
        hInstance                         /* handle to the instance to own window */
        );

    return TRUE;
}


/* Procedure called every time an instance of an application is destroyed */

void FAR PASCAL TemplateFree( hInstance )
HANDLE hInstance;
{
}

/* Procedure called when the application is loaded */

int TemplateInit()
{
    HANDLE      hRF;
    HMENU       hmenu, hMDmenu;
    PWNDCLASS   pTemplateClass;

        /* Setup some default brushes */
    hbrWhite = GetStockObject( WHITE_BRUSH );
    hbrBlack = GetStockObject( BLACK_BRUSH );
    hbrGray  = GetStockObject( GRAY_BRUSH );

        /* Allocate class structure in local heap */
    pTemplateClass = (PWNDCLASS)LocalAlloc( LPTR, sizeof(WNDCLASS) );

        /* Open a resource file */
    if (hRF = OpenResourceFile((LPSTR)"Template.res")) {
        pTemplateClass->hClsItTable = ItLoad( hRF, (LPSTR)"template" );
        pTemplateClass->hClsCursor  = CursorLoad( hRF, (LPSTR)"template" );
        pTemplateClass->hClsIconId  = IconLoad( hRF,(LPSTR)"template" );
        pTemplateClass->hMenu       = MenuLoad( hRF, (LPSTR)"template" );
        CloseResourceFile( hRF );
        }

    pTemplateClass->lpClsName    = (LPSTR) "Template";
    pTemplateClass->hBackBrush   = (HBRUSH) hbrWhite;

        /* The class chooses to have its origin in the top left of a window. */
    pTemplateClass->vOrigin       = TOP;
    pTemplateClass->hOrigin       = LEFT;

        /* The class choose to always redraw its contents whenever the window
           is sized */
    pTemplateClass->vUpdate       = REDRAW;
    pTemplateClass->hUpdate       = REDRAW;

        /* Fill in the addresses of our class procedures.  Each procedure
           must have been declared as a FAR PASCAL procedure.
         */
    pTemplateClass->clsWndCreate  = TemplateCreate;
    pTemplateClass->clsWndDestroy = TemplateDestroy;
    pTemplateClass->clsWndIcon    = TemplateIcon;
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
