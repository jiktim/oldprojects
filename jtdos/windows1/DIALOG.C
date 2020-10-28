/*============================================================================
    dialog.c

    Routines for manipulating dialog boxes.
============================================================================*/

#include    "windows.h"

extern  HANDLE  hDlg;
extern  HANDLE  hRF;

/*----------------------------------------------------------------------------
    Create a dialog box with the given template and dialog box driving
    routine.
----------------------------------------------------------------------------*/

BOOL DialogBox (hWindow, lpproc, szdlg)
HWND hWindow;
FARPROC lpproc;
LPSTR szdlg;
{

    hDlg = CreateDlg(hWindow, lpproc, hRF, szdlg);
}

/*----------------------------------------------------------------------------
    Take down a dialog box.
----------------------------------------------------------------------------*/

CloseDialogBox (hDlg)
HWND hDlg;
{
    DestroyWindow(hDlg);
}

/*----------------------------------------------------------------------------
   SetDlgItemInt

   Sets the text edit field of the given dialog to the number n.
----------------------------------------------------------------------------*/

SetDlgItemInt (hdlg, item, n)
HWND hdlg;
int item;
int n;
{
    char rgch[10];
    LPSTR lpch = (LPSTR)rgch;

    rgch[ncvtu(n, (LPSTR FAR *)&lpch)] = '\0';
    SetDlgItemText(hdlg, item, (LPSTR)rgch);
}

/*----------------------------------------------------------------------------
   GetDlgItemInt

   Gets the text edit field of the given dialog and translates it (if
   possible) into an integer.
----------------------------------------------------------------------------*/

int GetDlgItemInt (hdlg, item)
HWND hdlg;
int item;
{
    char rgch[255];

    rgch[GetDlgItemText(hdlg, item, (LPSTR)rgch, 255)] = '\0';
    return(ncvtsz((LPSTR)rgch));
}



/*----------------------------------------------------------------------------
   SetCtlInt

   Sets the text edit field of the given dialog to the number n.
----------------------------------------------------------------------------*/

SetCtlInt (hCtl, n)
HWND hCtl;
int n;
{
    char rgch[10];
    LPSTR lpch = (LPSTR)rgch;

    rgch[ncvtu(n, (LPSTR FAR *)&lpch)] = '\0';
    SetCtlText(hCtl, (LPSTR)rgch);
}
