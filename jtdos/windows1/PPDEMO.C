#include "windows.h"

FARPROC pPPDemoLoop;

/* ppdemo:
    This is a program which demonstrates how to use the pushpull converter.
Once loaded by windows, this app can be running in one of two places at
any given time.  One place is in the input proc, after windows has
passed it an event.  The other is in the input processing loop, which
is running as a separate task.  */

/* once this window is running, click the mouse in it, and type a key */
/* thereafter, when a key is typed, the character being painted will be */
/* changed */


#define MOUSEBUTTON 256
#define MOUSEMOVE 257

/* these char heights are not at all general, but this is just a demo */
/* if characters are variable pitch, or taller than 8 pixels, something */
/* strange will go on */
#define CHARHEIGHT 8
#define CHARWIDTH 8

HANDLE ppHandle;    /* the handle to the pushpull struct */
HWND hPPDemoWnd;      /* the handle to the ppdemo window */
char chOut;         /* the character currently being drawn */
HBRUSH mhbrWhite;   /* used to clear screen */

/* the create proc:
    This does very little except set up the pushpull converter.  All
    the real work will be taken care of in the input loop */

FAR PASCAL PPDemoCreate(hWindow)
HWND hWindow;
    {
    /* save the window handle */
    hPPDemoWnd = hWindow;

    /* set up the pushpull converter.  The task will be running PPDemoloop */
    /* and will have a stack size of 2K */
    ppHandle = CreatePushPull(pPPDemoLoop,2048);
    }

/* the class destroy proc */
FAR PASCAL PPDemoDestroy(hWindow, command, lpProc)
HWND hWindow;
int command;
FARPROC lpProc;
    {
    if (command == QUERYDESTROY)
        return(TRUE);
    else
        /* destroy the task started by the pushpull converter and free */
        /* up any associated memory */
        DestroyPushPull(ppHandle);
    }

/* the input proc */
/* this window receives two kinds of events.  One is the downclick of
a mouse-button, the other is keyboard input.  The event returned by
the downclick will have type NUMCODE.  In order to receive keyboard
input, the window must do a set focus sometime.  This input proc
uses the downclick to set the focus, and passes all keyboard input
into the pushpull converter.  If there were an event which generates
more than one result, such as a mousebutton going down which might
generate a numcode and then the mouse coordinates, the input proc
would have to loop through all the resultblocks (there are argc of
them), saving the event.  This is not the case with this application. */

FAR PASCAL PPDemoInput(hWindow, argc, argv)
HWND        hWindow;
int         argc;
RESULTBLOCK FAR *argv;
    {
    int i;

    /* if the type is NUMCODE, then it's a downclick: set the focus */
    if (argv[0].type == NUMCODE)
        SetFocus(hWindow, NULL, (FARPROC)NULL);
    /* otherwise, it's a key:  save it */
    else
        SaveEvent(ppHandle, argv);
    }

/* the meat of this program */
/* This procedure polls for input.  If there is an event in the queue,
    then it gets the event, and sets the output character to be the
    character in the event.  The procedure then prints out the
    current character and loops. */

FAR PASCAL PPDemoLoop()
    {
    RESULTBLOCK ResultBlock;
    int i, j;
    HDC hDC;
    RECT rect;
    int lines, cols;

    /* get the client rectangle */
    GetClientRect(hPPDemoWnd, (LPRECT)&rect);

    /* figure out how many "characters" can fit on a line and down the screen */
    /* NOTE: this routine is very stupid.  These two lines get executed only */
    /* once, and if the size of the window changes, it does not adjust. */
    lines = rect.bottom / CHARHEIGHT;
    cols = rect.right / CHARWIDTH;

    while(TRUE)
        {
        /* clear the screen */
        if (!IsIconic(hPPDemoWnd))
            {
            hDC = GetDC(hPPDemoWnd);
            FillRect(hDC, (LPRECT)&rect, mhbrWhite);
            ReleaseDC(hPPDemoWnd, hDC);
            }
        /* for each character position on each line of the screen */
        for(i = 0; i < lines; ++i)
            {
            /* do a yield at the beginning of each row, so that */
            /* other windows can do things */
            Yield();
            for(j = 0; j < cols; ++j)
                if (!IsIconic(hPPDemoWnd))
                    {
                    /* see if there is an event in the queue */
                    if(PeekNextEvent(ppHandle, (LPRESULTBLOCK)&ResultBlock))
                        {
                        /* if there is, get it */
                        GetNextEvent(ppHandle, (LPRESULTBLOCK)&ResultBlock);
                        /* set the current character */
                        chOut = ResultBlock.resval.charval.c[0];
                        }
                    /* put out the current character */
                    hDC = GetDC(hPPDemoWnd);
                    TextOut(hDC, j*8, i*8, (LPSTR)&chOut, 1);
                    ReleaseDC(hPPDemoWnd, hDC);
                    }
            }
        }
    }


BOOL
FAR PASCAL PPDemoLoad(hInstance, hPrev, lpParms)
HANDLE hInstance,hPrev;
LPNEWPARMS lpParms;
    {

    /* get the white brush */
    mhbrWhite = GetStockObject(WHITE_BRUSH);

    if (!hPrev)
        if (!PPDemoInit())
            return FALSE;

    pPPDemoLoop = MakeProcInstance( (FARPROC)PPDemoLoop, hInstance );

    /* create a ppdemo window */
    lpParms->hWnd = CreateWindow(
              (LPSTR) "PushPullDemo", /* The class name                                                  */
              (LPSTR) "PushPull Demo",/* The window instance name                                        */
              FALSE,                  /* A flag requesting the window to be created open */
              FALSE,                  /* A Flag requesting a vertical scroll bar                         */
              FALSE,                  /* A Flag requesting a horizontical scroll bar                     */
              NULL,                   /* The window instance will be created with the class default menu */
              100,                    /* A desired height of one hundred screen pixels                   */
              0,                      /* The window wants to be opened in column zero (ignored           */
              hInstance);

    return TRUE;
    }

/* the class free proc */
FAR PASCAL PPDemoFree(hInstance, bLastInstance)
HANDLE hInstance;
BOOL bLastInstance;
    {
    return(TRUE);
    }


int PPDemoInit()
    {
    PWNDCLASS pPPDemoClass;
    HANDLE hPPDemoRF;

    /* allocate a window class data structure */
    pPPDemoClass = (PWNDCLASS) LocalAlloc(LPTR, sizeof(WNDCLASS));

    /* set the class name */
    pPPDemoClass->lpClsName     = (LPSTR)"PushPullDemo";

    /* get the resource file info: cursor, icon, it table */
    if(hPPDemoRF = OpenResourceFile((LPSTR)"ppdemo.res"))
        {
        pPPDemoClass->hClsCursor = CursorLoad(hPPDemoRF, (LPSTR)"ppdemo");
        pPPDemoClass->hClsIconId = IconLoad(hPPDemoRF,(LPSTR)"ppdemo");
        pPPDemoClass->hClsItTable = ItLoad(hPPDemoRF,(LPSTR)"ppdemo");
        CloseResourceFile(hPPDemoRF);
        }

    pPPDemoClass->hBackBrush  = mhbrWhite;

    /* set the class procedures */
    pPPDemoClass->clsWndCreate   = PPDemoCreate;
    pPPDemoClass->clsWndInput    = PPDemoInput;
    pPPDemoClass->clsWndDestroy  = PPDemoDestroy;

    /* register this new class with WINDOWS */

    if (!RegisterClass((LPWNDCLASS) pPPDemoClass))
        return FALSE;

    /* free up the memory */
    Free((HANDLE)pPPDemoClass);

    /* registration worked */
    return TRUE;
    }
