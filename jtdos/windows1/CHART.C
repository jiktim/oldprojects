#include "windows.h"
#include "menudefs.h"
#include "chdefs.h"

#define dxScrBar        14
#define dyScrBar        6
#define dxSplBox        5
#define dySplBox        (dyScrBar - 1)
#define dxSplBar        dxSplBox
#define dySplBar        2

struct DWD                      /* Data Window Descriptor */
    {
    HWND hww;                   /* handle to the window */
    int dy;                     /* starting row in series window */
    int iSeries;                /* describes the series in the window */
    };

BOOL far PASCAL ChartDialog (HWND, int, RESULTBLOCK far *);
void PaintChildWindows (void);
void SizeDataWindows (int, int);
int IwwDataFromHww (HWND);

static FARPROC lpprocChartDialog;

static HANDLE vhResFile;        /* handle to the resource file */
static HANDLE vhbrWhite;        /* handle to a white brush */
static HANDLE vhbrLtGray;       /* handle to a light gray brush */
static HANDLE vhbrGray;         /* handle to a gray brush */
static HANDLE vhbrDkGray;       /* handle to a dark gray brush */
static HANDLE vhbrBlack;        /* handle to a black brush */
static HANDLE vhpnNull;         /* handle to null pen */

static HANDLE vhModInst;        /* handle to the module instance */
static HWND vhwwParent;         /* handle to the main chart window */
static HWND vhwwSeries;         /* handle to the series window */
static HANDLE vhrgdwd;          /* handle to the array of descriptors of the
                                   data windows */
static RECT vrcParent;          /* describes the boundary of parent window */
static RECT vrcVSplBox;         /* describes the vertical splitter box */
static RECT vrcVSplBar;         /* describes the vertical splitter bar */
static RECT vrcHSplBar;         /* describes the horizontal splitter bar */
static int vdxwwSeries = 0;     /* the width of the series window */
static int vcwwData = 1;        /* number of data windows */
static int viSeries = 0;        /* index of the current data series */
static int viwwHSplBar;         /* index of the data window below the
                                   horizontal splitter bar. */
static BOOL vfVSplMove = FALSE; /* indicates if the vertical splitter bar is
                                   moving */
static BOOL vfHSplMove = FALSE; /* indicates if the horizontal splitter bar is
                                   moving */



int far PASCAL ChartCreate (hww)
HWND hww;
    {
    }


int far PASCAL ChartPaint (hww, hDC, fErase, lpRect, pHint)
HWND hww;
HDC hDC;
BOOL fErase;
LPRECT lpRect;
LPINT pHint;
    {
    int dcLevel;

    /* Clip the window at the vertical splitter bar. */
    dcLevel = SaveDC (hDC);
    IntersectClipRect (hDC, vrcParent.left, vrcParent.top, vrcParent.right -
      vdxwwSeries, vrcParent.bottom);

    /* Draw the "scroll" bars. */
    MoveTo (hDC, vrcParent.left, vrcParent.bottom - dyScrBar);
    LineTo (hDC, vrcParent.right, vrcParent.bottom - dyScrBar);
    MoveTo (hDC, vrcParent.right - dxScrBar, vrcParent.top);
    LineTo (hDC, vrcParent.right - dxScrBar, vrcParent.bottom);
    FillRect (hDC, (LPRECT)&vrcVSplBox, vhbrBlack);

    /* Clip the window to inside the "scroll" or vertical splitter bars. */
    IntersectClipRect (hDC, vrcParent.left, vrcParent.top, vrcParent.right -
      max (vdxwwSeries, dxScrBar), vrcParent.bottom - dyScrBar);

    /* Let's draw a chart. First the axes. */
    MoveTo (hDC, 130, 30);
    LineTo (hDC, 130, 140);
    LineTo (hDC, 350, 140);

    /* Draw the tick marks on the vertical axis. */
    MoveTo (hDC, 127, 40);
    LineTo (hDC, 130, 40);
    MoveTo (hDC, 127, 50);
    LineTo (hDC, 130, 50);
    MoveTo (hDC, 127, 60);
    LineTo (hDC, 130, 60);
    MoveTo (hDC, 127, 70);
    LineTo (hDC, 130, 70);
    MoveTo (hDC, 127, 80);
    LineTo (hDC, 130, 80);
    MoveTo (hDC, 127, 90);
    LineTo (hDC, 130, 90);
    MoveTo (hDC, 127, 100);
    LineTo (hDC, 130, 100);
    MoveTo (hDC, 127, 110);
    LineTo (hDC, 130, 110);
    MoveTo (hDC, 127, 120);
    LineTo (hDC, 130, 120);
    MoveTo (hDC, 127, 130);
    LineTo (hDC, 130, 130);

    /* Draw the tick marks on the horizontal axis. */
    MoveTo (hDC, 165, 143);
    LineTo (hDC, 165, 140);
    MoveTo (hDC, 215, 143);
    LineTo (hDC, 215, 140);
    MoveTo (hDC, 265, 143);
    LineTo (hDC, 265, 140);
    MoveTo (hDC, 315, 143);
    LineTo (hDC, 315, 140);

    /* vhpnNull = SelectObject( hDC, vhpnNull ); */

    /* Draw the columns. */
    SelectObject (hDC, vhbrDkGray);
    Rectangle (hDC, 150, 100, 180, 140);
    Rectangle (hDC, 200, 80, 230, 140);
    Rectangle (hDC, 250, 110, 280, 140);
    Rectangle (hDC, 300, 90, 330, 140);
    Rectangle (hDC, 350, 50, 370, 60);

    SelectObject (hDC, vhbrLtGray);
    Rectangle (hDC, 150, 60, 180, 100);
    Rectangle (hDC, 200, 50, 230, 80);
    Rectangle (hDC, 250, 80, 280, 110);
    Rectangle (hDC, 300, 70, 330, 90);
    Rectangle (hDC, 350, 30, 370, 40);

    /* vhpnNull = SelectObject( hDC, vhpnNull ); */

    /* Add in the labels. */
    TextOut (hDC, 130, 10, (LPSTR)"Sales: Martin-Ford Corporation", 30);
    TextOut (hDC, 377, 32, (LPSTR)"Left-handed Widgets", 19);
    TextOut (hDC, 377, 52, (LPSTR)"Right-handed Widgets", 20);
    TextOut (hDC, 15, 71, (LPSTR)"Sales", 5);
    TextOut (hDC, 15, 81, (LPSTR)"$(000)",6);
    TextOut (hDC, 97, 36, (LPSTR)"100", 3);
    TextOut (hDC, 97, 46, (LPSTR)" 90", 3);
    TextOut (hDC, 97, 56, (LPSTR)" 80", 3);
    TextOut (hDC, 97, 66, (LPSTR)" 70", 3);
    TextOut (hDC, 97, 76, (LPSTR)" 60", 3);
    TextOut (hDC, 97, 86, (LPSTR)" 50", 3);
    TextOut (hDC, 97, 96, (LPSTR)" 40", 3);
    TextOut (hDC, 97, 106, (LPSTR)" 30", 3);
    TextOut (hDC, 97, 116, (LPSTR)" 20", 3);
    TextOut (hDC, 97, 126, (LPSTR)" 10", 3);
    TextOut (hDC, 149, 145, (LPSTR)"1981", 4);
    TextOut (hDC, 199, 145, (LPSTR)"1982", 4);
    TextOut (hDC, 249, 145, (LPSTR)"1983", 4);
    TextOut (hDC, 299, 145, (LPSTR)"1984", 4);

    /* Restore the window boundaries. */
    RestoreDC (hDC, dcLevel);
    }


int far PASCAL ChartInput (hww, cArg, rgArg)
HWND hww;
int cArg;
RESULTBLOCK far *rgArg;
    {
    RESULTBLOCK far *pArg;
    RESULTBLOCK far *pArgMax = (RESULTBLOCK far *)&rgArg[cArg - 1];
    POINT ptMouse;
    HANDLE hDC;

    for (pArg = rgArg; pArg <= pArgMax; pArg++)
        {
        switch (pArg->type)
            {
            case NUMCODE:
                switch (pArg->resval.numval.n)
                    {

                    /* Mouse clicks for vertical splitter bar. */
                    case iMouseUp:
                        ptMouse.x = (++pArg)->resval.mouseval.x;
                        ptMouse.y = pArg->resval.mouseval.y;

                        if (vfVSplMove)
                            {
                            /* The vertical splitter bar is moving, invert the
                               splitter bar back to normal and update the
                               position of the series window. */
                            hDC = GetDC (hww);
                            InvertRect (hDC, (LPRECT)&vrcVSplBar);
                            ReleaseDC (hww, hDC);
                            vdxwwSeries = vrcParent.right - ptMouse.x;
                            if (vdxwwSeries <= dxScrBar + dxSplBar)
                                {
                                vdxwwSeries = 0;
                                }
                            MoveChild (vhwwSeries, hww, vrcParent.right -
                              vdxwwSeries, 0, vdxwwSeries, vrcParent.bottom,
                              FALSE);

                            /* Repaint all windows. */
                            PaintWindow (hww, TRUE, (LPRECT)NULL,
                              (LPINT)NULL);
                            PaintChildWindows ();
                            vfVSplMove = FALSE;
                            }
                        break;

                    case iMouseDown:
                        ptMouse.x = (++pArg)->resval.mouseval.x;
                        ptMouse.y = pArg->resval.mouseval.y;

                        if (PtInRect ((LPRECT)&vrcVSplBox, (LPPOINT)&ptMouse))
                            {/* The mouse is in the splitter box.  Invert the
                                splitter bar and set the appropriate flags. */
                            vrcVSplBar = vrcVSplBox;
                            vrcVSplBar.top = 0;
                            hDC = GetDC (hww);
                            FillRect (hDC, (LPRECT)&vrcVSplBox,
                              vhbrWhite);
                            InvertRect (hDC, (LPRECT)&vrcVSplBar);
                            ReleaseDC (hww, hDC);
                            vfVSplMove = TRUE;
                            }
                        break;

                    /* Menu items. */
                    case miSequence:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiSequence");
                        break;
                    case miDate:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiDate");
                        break;
                    case miText:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiText");
                        break;
                    case miNumber:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiNumber");
                        break;
                    case miSort:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiSort");
                        break;
                    case miAnalyze:
                        CreateDlg (hww, lpprocChartDialog,
                          vhResFile, (LPSTR)"idiAnalyze");
                        break;
                    }
                break;

            /* Mouse coordinates for vertical splitter bar movement. */
            case MSCRDCODE:
                ptMouse.x = pArg->resval.mouseval.x;
                ptMouse.y = pArg->resval.mouseval.y;

                /* If the vertical splitter bar is on the move and the mouse
                   is not in the splitter bar, the invert the splitter bar
                   back to normal, update its position, and invert it. */
                if (vfVSplMove && !PtInRect ((LPRECT)&vrcVSplBar,
                  (LPPOINT)&ptMouse))
                    {
                    hDC = GetDC (hww);
                    InvertRect (hDC, (LPRECT)&vrcVSplBar);
                    vrcVSplBar.left = min (ptMouse.x, (vrcParent.right -
                      dxScrBar) - dxSplBar);
                    vrcVSplBar.right = vrcVSplBar.left + dxSplBar;
                    InvertRect (hDC, (LPRECT)&vrcVSplBar);
                    ReleaseDC (hww, hDC);
                    }
                break;
            }
        }
    }


int far PASCAL ChartSize (hww, cxNew, cyNew)
HWND hww;
int cxNew;
int cyNew;
    {
    /* Save the new dimension of the parent window. */
    SetRect ((LPRECT)&vrcParent, 0, 0, cxNew, cyNew);

    /* Reposition the vertical scroll box. */
    SetRect ((LPRECT)&vrcVSplBox, cxNew - dxScrBar - dxSplBox, cyNew -
      dySplBox, cxNew - dxScrBar, cyNew);

    /* Resize and move the series window. */
    MoveChild (vhwwSeries, hww, cxNew - vdxwwSeries, 0, vdxwwSeries, cyNew,
      FALSE);
    }


int far PASCAL SeriesCreate (hww)
HWND hww;
    {
    }


int far PASCAL SeriesPaint (hww, hDC, fErase, lpRect, pHint)
HWND hww;
HDC hDC;
BOOL fErase;
LPRECT lpRect;
LPINT pHint;
    {
    }


int far PASCAL SeriesInput (hww, cArg, rgArg)
HWND hww;
int cArg;
RESULTBLOCK far *rgArg;
    {
    RESULTBLOCK far *pArg;
    RESULTBLOCK far *pArgMax = (RESULTBLOCK far *)&rgArg[cArg - 1];
    POINT ptMouse;
    HANDLE hDC;

    /* If the vertical splitter bar is moving, pass all input to the parent
       window, adjusting all mouse coordinates. */
    if (vfVSplMove)
        {
        for (pArg = rgArg; pArg <= pArgMax; pArg++)
            {
            if (pArg->type == MSCRDCODE)
                {
                pArg->resval.mouseval.x += vrcParent.right - vdxwwSeries;
                }
            }
        NotifyWindow (vhwwParent, cArg, rgArg);
        return;
        }

    /* Else, process each event as usual. */
    for (pArg = rgArg; pArg <= pArgMax; pArg++)
        {
        switch (pArg->type)
            {
            case NUMCODE:
                switch (pArg->resval.numval.n)
                    {

                    /* Mouse clicks for vertical splitter bar. */
                    case iMouseUp:
                        ptMouse.x = (++pArg)->resval.mouseval.x;
                        ptMouse.y = pArg->resval.mouseval.y;

                        if (vfHSplMove)
                            {
                            struct DWD *rgdwd =
                              (struct DWD *)LockLocalObject (vhrgdwd);
                            int dyMin = viwwHSplBar == 0 ? dySplBar :
                              rgdwd[viwwHSplBar - 1].dy;
                            int dyNew;
                            int iww;

                            /* Invert the splitter bar back to normal. */
                            hDC = GetDC (hww);
                            InvertRect (hDC, (LPRECT)&vrcHSplBar);
                            ReleaseDC (hww, hDC);

                            /* Adjust the sizes of the data windows. */
                            dyNew = max (ptMouse.y, dyMin) -
                              rgdwd[viwwHSplBar].dy;

                            /* Don't do alot of work if the window has not
                               changed size. */
                            if (dyNew == 0)
                                {
                                UnlockLocalObject (vhrgdwd);
                                vfHSplMove = FALSE;
                                continue;
                                }

                            for (iww = viwwHSplBar; iww < vcwwData; iww++)
                                {
                                rgdwd[iww].dy += dyNew;
                                }

                            /* Was a window opened with the splitter bar? */
                            if (viwwHSplBar == 0)
                                {
                                /* Expand the array of window descriptors. */
                                UnlockLocalObject (vhrgdwd);
                                LocalReAlloc (vhrgdwd, ++vcwwData *
                                  sizeof (struct DWD), LHND);
                                rgdwd =
                                  (struct DWD *)LockLocalObject (vhrgdwd);
                                for (iww = vcwwData; iww > 0; iww--)
                                    {
                                    rgdwd[iww] = rgdwd[iww - 1];
                                    }

                                /* Insert a new window. */
                                (*rgdwd).hww = CreateChild ((LPSTR)"Data",
                                  vhwwSeries, (LPSTR)NULL, FALSE, TRUE, FALSE,
                                  FALSE, TRUE, 0, 0, 0, 0, vhModInst);
                                (*rgdwd).dy = dySplBar;
                                (*rgdwd).iSeries = viSeries++;
                                }

                            /* Was a window closed with the splitter bar? */
                            else if (rgdwd[viwwHSplBar].dy  ==
                              rgdwd[viwwHSplBar - 1].dy)
                                {
                                ShowWindow (rgdwd[viwwHSplBar - 1].hww,
                                  HIDE_WINDOW);

                                /* Remove the window from the array of window
                                   descriptors. */
                                for (iww = viwwHSplBar; iww < vcwwData; iww++)
                                    {
                                    rgdwd[iww - 1] = rgdwd[iww];
                                    }
                                vcwwData--;
                                }

                            /* The data windows are now adjusted; clean up the
                               heap and the screen. */
                            UnlockLocalObject (vhrgdwd);
                            SizeDataWindows (vdxwwSeries, vrcParent.bottom);
                            PaintChildWindows ();
                            vfHSplMove = FALSE;
                            }
                        break;

                    case iMouseDown:
                        ptMouse.x = (++pArg)->resval.mouseval.x;
                        ptMouse.y = pArg->resval.mouseval.y;

                        if (ptMouse.x < dxSplBar)
                            {/* The mouse is in the vertical splitter bar.
                                Turn the splitter bar gray and then invert it
                                (to show where the mouse is). */
                            SetRect ((LPRECT)&vrcVSplBar, 0, 0, dxSplBar,
                              vrcParent.bottom);
                            hDC = GetDC (hww);
                            FillRect (hDC, (LPRECT)&vrcVSplBar, vhbrDkGray);
                            InvertRect (hDC, (LPRECT)&vrcVSplBar);
                            ReleaseDC (hww, hDC);

                            /* Reposition the splitter bar relative to the
                               parent window. */
                            vrcVSplBar.right = (vrcVSplBar.left =
                              vrcParent.right - vdxwwSeries) + dxSplBar;
                            vfVSplMove = TRUE;
                            }
                        else
                            {
                            /* The mouse must be in a horizontal splitter bar.
                               First, find out which window is below it. */

                            int dyww;
                            struct DWD *rgdwd =
                              (struct DWD *)LockLocalObject (vhrgdwd);

                            for (viwwHSplBar = 0; viwwHSplBar < vcwwData;
                              viwwHSplBar++)
                                {
                                dyww = rgdwd[viwwHSplBar].dy;

                                if (ptMouse.y < dyww && ptMouse.y >= dyww -
                                  dySplBar)
                                    {
                                    break;
                                    }
                                }

                            /* Now that we can set the horizontal scroll bar,
                               paint it gray and then invert it. */
                            SetRect ((LPRECT)&vrcHSplBar, 0, dyww - dySplBar,
                              vdxwwSeries, dyww);
                            hDC = GetDC (hww);
                            FillRect (hDC, (LPRECT)&vrcHSplBar, vhbrDkGray);
                            InvertRect (hDC, (LPRECT)&vrcHSplBar);
                            ReleaseDC (hww, hDC);
                            UnlockLocalObject (vhrgdwd);
                            vfHSplMove = TRUE;
                            }
                        break;
                    }
                break;

            case MSCRDCODE:
                ptMouse.x = pArg->resval.mouseval.x;
                ptMouse.y = pArg->resval.mouseval.y;

                /* If the horizontal splitter bar is on the move and the mouse
                   is not in the splitter bar, the invert the splitter bar
                   back to normal, update its position, and invert it. */
                if (vfHSplMove && !PtInRect ((LPRECT)&vrcHSplBar,
                  (LPPOINT)&ptMouse))
                    {
                    struct DWD *rgdwd =
                      (struct DWD *)LockLocalObject (vhrgdwd);
                    int dyMin = viwwHSplBar == 0 ? dySplBar :
                      rgdwd[viwwHSplBar - 1].dy;

                    hDC = GetDC (hww);
                    InvertRect (hDC, (LPRECT)&vrcHSplBar);
                    vrcHSplBar.bottom = max (ptMouse.y, dyMin);
                    vrcHSplBar.top = vrcHSplBar.bottom - dySplBar;
                    InvertRect (hDC, (LPRECT)&vrcHSplBar);
                    ReleaseDC (hww, hDC);
                    UnlockLocalObject (vhrgdwd);
                    }
                break;
            }
        }
    }


int far PASCAL SeriesSize (hww, cxNew, cyNew)
HWND hww;
int cxNew;
int cyNew;
    {
    /* Reposition the data windows. */
    SizeDataWindows (cxNew, cyNew);
    }


int far PASCAL DataCreate (hww)
HWND hww;
    {
    }


int far PASCAL DataPaint (hww, hDC, fErase, lpRect, pHint)
HWND hww;
HDC hDC;
BOOL fErase;
LPRECT lpRect;
LPINT pHint;
    {
    RECT rcBounds;
    int iww = IwwDataFromHww (hww);
    struct DWD *rgdwd = (struct DWD *)LockLocalObject (vhrgdwd);

    /* Draw the basic form of the window. */
    GetClientRect (hww, (LPRECT)&rcBounds);

    MoveTo (hDC, 0, 12);
    LineTo (hDC, rcBounds.right, 12);
    MoveTo (hDC, 9, 3);
    LineTo (hDC, 19, 3);
    LineTo (hDC, 19, 7);
    LineTo (hDC, 9, 7);
    LineTo (hDC, 9, 3);
    TextOut (hDC, 29, 2, (LPSTR)"Plot", 4);
    MoveTo (hDC, 0, 24);
    LineTo (hDC, rcBounds.right, 24);
    MoveTo (hDC, 100, 12);
    LineTo (hDC, 100, rcBounds.bottom);
    MoveTo (hDC, 200, 12);
    LineTo (hDC, 200, rcBounds.bottom);
    TextOut (hDC, 46, 15, (LPSTR)"X", 1);
    TextOut (hDC, 146, 15, (LPSTR)"Y", 1);

    /* Now comes the information particular to each data window. */
    switch (rgdwd[iww].iSeries)
        {
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
    UnlockLocalObject (vhrgdwd);
    }


int far PASCAL DataInput (hww, cArg, rgArg)
HWND hww;
int cArg;
RESULTBLOCK far *rgArg;
    {

    /* If the vertical splitter bar is moving, pass all input to the parent
       window, adjusting all mouse coordinates. */
    if (vfVSplMove)
        {
        RESULTBLOCK far *pArg;
        RESULTBLOCK far *pArgMax = (RESULTBLOCK far *)&rgArg[cArg - 1];

        for (pArg = rgArg; pArg <= pArgMax; pArg++)
            {
            if (pArg->type == MSCRDCODE)
                {
                pArg->resval.mouseval.x += (vrcParent.right - vdxwwSeries) +
                  dxSplBar;
                }
            }
        NotifyWindow (vhwwParent, cArg, rgArg);
        }

    /* Else, if the horizontal splitter bar is moving, pass all input to the
       series window, adjusting all mouse coordinates. */
    else if (vfHSplMove)
        {
        RESULTBLOCK far *pArg;
        RESULTBLOCK far *pArgMax = (RESULTBLOCK far *)&rgArg[cArg - 1];
        int iww = IwwDataFromHww (hww);
        struct DWD *rgdwd = (struct DWD *)LockLocalObject (vhrgdwd);

        for (pArg = rgArg; pArg <= pArgMax; pArg++)
            {
            if (pArg->type == MSCRDCODE)
                {
                pArg->resval.mouseval.y += rgdwd[iww].dy;
                }
            }
        NotifyWindow (vhwwSeries, cArg, rgArg);
        UnlockLocalObject (vhrgdwd);
        }
    }


int far PASCAL DataSize (hww, cxNew, cyNew)
HWND hww;
int cxNew;
int cyNew;
    {
    }


BOOL far PASCAL ChartDialog (hDlg, cArg, rgArg)
/* Generic dialog handler; closes the dialog box with any response. */

HWND hDlg;
int cArg;
RESULTBLOCK far *rgArg;
    {
    if (cArg != 0 && rgArg[0].type == NUMCODE)
        {
        switch (rgArg[0].resval.numval.n)
            {
            default:
                DestroyDlg (hDlg);
            case 0:
                break;
            }
        }
    return (TRUE);
    }


void PaintChildWindows ()
/* This routine paints all of the child windows (series and data). */

    {
    int iww;
    struct DWD *rgdwd = (struct DWD *)LockLocalObject (vhrgdwd);

    /* Paint the series window. */
    PaintWindow (vhwwSeries, TRUE, (LPRECT)NULL, (LPINT)NULL);

    /* Paint each of the data windows. */
    for (iww = 0; iww < vcwwData; iww++)
        {
        PaintWindow (rgdwd[iww].hww, TRUE, (LPRECT)NULL, (LPINT)NULL);
        }
    UnlockLocalObject (vhrgdwd);
    }


void SizeDataWindows (cx, cy)
/* This routine sizes the data windows into a series window cx wide and cy
high. */

int cx;
int cy;

    {
    int iww;
    struct DWD *rgdwd;
    if (rgdwd = (struct DWD *)LockLocalObject (vhrgdwd))
        {
        /* Size all but the last data window. */
        for (iww = 0; iww < vcwwData - 1; iww++)
            {
            MoveChild (rgdwd[iww].hww, vhwwSeries, dxSplBar, rgdwd[iww].dy,
              cx - dxSplBar, (rgdwd[iww + 1].dy - rgdwd[iww].dy) - dySplBar,
              FALSE);
            }

        /* Size the last data window so that it fill the rest of the series
           window. */
        MoveChild (rgdwd[iww].hww, vhwwSeries, dxSplBar, rgdwd[iww].dy, cx -
          dxSplBar, (cy - rgdwd[iww].dy) + 1, FALSE);
        UnlockLocalObject (vhrgdwd);
        }
    }


int IwwDataFromHww (hww)
/* The routine returns the index of a data window (into the array of data
window descriptors) when passed a handle to the window.  If the index is not
found, then the number of data windows is returned. */

HWND hww;

    {
    int iww;
    struct DWD *rgdwd = (struct DWD *)LockLocalObject (vhrgdwd);

    for (iww = 0; iww < vcwwData; iww++)
        {
        if (rgdwd[iww].hww == hww)
            {
            break;
            }
        }
    UnlockLocalObject (vhrgdwd);
    return (iww);
    }


ChartInit ()
    {
    PWNDCLASS pChartCls;
    PWNDCLASS pSeriesCls;
    PWNDCLASS pDataCls;

    /* Get handles to stock brushes. */
    vhbrWhite  = GetStockObject (WHITE_BRUSH);
    vhbrLtGray = GetStockObject (LTGRAY_BRUSH);
    vhbrGray   = GetStockObject (GRAY_BRUSH);
    vhbrDkGray = GetStockObject (DKGRAY_BRUSH);
    vhbrBlack  = GetStockObject (BLACK_BRUSH);
    vhpnNull   = GetStockObject (NULL_PEN);

    /* Set up the "Chart" window class structure. */
    pChartCls = (PWNDCLASS)LocalAlloc (LPTR, sizeof (WNDCLASS));
    pChartCls->lpClsName = (LPSTR)"Chart";

    if (vhResFile = OpenResourceFile ((LPSTR)"chart.res"))
        {
        pChartCls->hClsItTable = ItLoad (vhResFile, (LPSTR)"Chart");
        pChartCls->hMenu = MenuLoad (vhResFile, (LPSTR)"MenuBar");
        pChartCls->hClsIconId = IconLoad (vhResFile, (LPSTR)"Chart");
        pChartCls->hClsCursor = CursorLoad (vhResFile, (LPSTR)"Arrow");
        }

    pChartCls->hBackBrush = vhbrWhite;
    pChartCls->vUpdate = REDRAW;
    pChartCls->hUpdate = REDRAW;

    pChartCls->clsWndCreate = ChartCreate;
    pChartCls->clsWndInput = ChartInput;
    pChartCls->clsWndPaint = ChartPaint;
    pChartCls->clsWndSize = ChartSize;

    /* Set up the "Series" window class structure. */
    pSeriesCls = (PWNDCLASS)LocalAlloc (LPTR, sizeof (WNDCLASS));
    pSeriesCls->lpClsName = (LPSTR)"Series";

    if (vhResFile != NULL)
        {
        pSeriesCls->hClsItTable = ItLoad (vhResFile, (LPSTR)"Chart");
        pSeriesCls->hClsCursor = CursorLoad (vhResFile, (LPSTR)"Arrow");
        }

    pSeriesCls->hBackBrush = vhbrBlack;
    pSeriesCls->vUpdate = REDRAW;
    pSeriesCls->hUpdate = REDRAW;

    pSeriesCls->clsWndCreate = SeriesCreate;
    pSeriesCls->clsWndInput = SeriesInput;
    pSeriesCls->clsWndPaint = SeriesPaint;
    pSeriesCls->clsWndSize = SeriesSize;

    /* Set up the "Data" window class structure. */
    pDataCls = (PWNDCLASS)LocalAlloc (LPTR, sizeof (WNDCLASS));
    pDataCls->lpClsName = (LPSTR)"Data";

    if (vhResFile != NULL)
        {
        pDataCls->hClsItTable = ItLoad (vhResFile, (LPSTR)"Chart");
        pDataCls->hClsCursor = CursorLoad (vhResFile, (LPSTR)"Arrow");
        }

    pDataCls->hBackBrush = vhbrWhite;
    pDataCls->vUpdate = REDRAW;
    pDataCls->hUpdate = REDRAW;

    pDataCls->clsWndCreate = DataCreate;
    pDataCls->clsWndInput = DataInput;
    pDataCls->clsWndPaint = DataPaint;
    pDataCls->clsWndSize = DataSize;

    /* Register the window classes. */
    if (RegisterClass ((LPWNDCLASS)pChartCls) &&
       RegisterClass ((LPWNDCLASS)pSeriesCls) &&
       RegisterClass ((LPWNDCLASS)pDataCls))
        {
        Free ((char *)pChartCls);
        Free ((char *)pSeriesCls);
        Free ((char *)pDataCls);
        return (TRUE);
        }
    else
        {
        Free ((char *)pChartCls);
        Free ((char *)pSeriesCls);
        Free ((char *)pDataCls);
        return (FALSE);
        }
    }


int far PASCAL ChartLoad (hInstance,  hPrev, lpParms)
HANDLE hInstance;
HANDLE hPrev;
LPNEWPARMS lpParms;
    {
    struct DWD *rgdwd;

    if (!hPrev)
        {
        if (!ChartInit())
            return FALSE;
        }
    else
        {
            /* Copy global instance variables from previous instance */
            GetInstanceData( hPrev, (PSTR)&vhbrWhite, sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)&vhbrLtGray,sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)&vhbrGray,  sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)&vhbrDkGray,sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)&vhbrBlack, sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)&vhpnNull,  sizeof(vhbrWhite));
            GetInstanceData( hPrev, (PSTR)& vhResFile,sizeof(vhResFile));
        }

    InitCtlMgr ();
    lpprocChartDialog = MakeProcInstance((FARPROC)ChartDialog,hInstance);

    lpParms->hWnd = vhwwParent = CreateWindow ((LPSTR)"Chart", (LPSTR)"Chart",
      TRUE, FALSE, FALSE, NULL, 100, 0, vhModInst = hInstance);

    vhwwSeries = CreateChild ((LPSTR)"Series", vhwwParent, (LPSTR)"Series",
      FALSE, TRUE, FALSE, FALSE, FALSE, 0, 0, 0, 0, vhModInst);

    vhrgdwd = LocalAlloc (LHND, sizeof (struct DWD));
    rgdwd = (struct DWD *)LockLocalObject (vhrgdwd);
    (*rgdwd).hww = CreateChild ((LPSTR)"Data", vhwwSeries, (LPSTR)NULL, FALSE,
      TRUE, FALSE, TRUE, TRUE, 0, 0, 0, 0, vhModInst);
    (*rgdwd).dy = dySplBar;
    (*rgdwd).iSeries = viSeries++;
    UnlockLocalObject (vhrgdwd);
    }
