/*============================================================================
   menuid.c

   This program scans through a Microsoft Windows resource script
   file and creates IDs for the various result and id fields found
   in the dialog box and menu definitions.  These IDs can be used
   as identifiers for the various menu and dialog functions in the
   Windows menu and dialog code.  We produce a C include file (sent
   to menu.h) and the input file argv[1] gets translated into a
   .rc file with the identifiers turned into numbers (as rc likes
   it).  Output goes to argv[2], if specified.
============================================================================*/

#include <stdio.h>

char toupper (char);

typedef int     BOOL;
#define TRUE    1
#define FALSE   0

#define imaxItem    20              /* max number of parsed items/line */

#define TYNULL      0               /* types of things allowed in a line */
#define TYSTRING    1
#define TYNUMBER    2
#define TYID        3
#define TYCOMMA     4

typedef struct {                /* parsed line structure */
    int cItem;                      /* count of items in line */
    int rgtyItem[imaxItem];         /* array of item types */
    int rgItem[imaxItem];           /* array of items */
    char *pch;                      /* pointer into string space */
    char rgch[256];                 /* string space */
} PL;

#define imaxKey 8

static char *rgszKey[imaxKey] = {
    "IT",
    "CURSOR",
    "ICON",
    "BITMAP",
    "PFONT",
    "DIALOG",
    "MENU"
};

int fnIt(), fnCursor(), fnIcon(), fnBitmap(), fnPfont(), fnDialog(), fnMenu();

static int (*rgpfnKey[imaxKey])() = {
    fnIt,
    fnCursor,
    fnIcon,
    fnBitmap,
    fnPfont,
    fnDialog,
    fnMenu
};

#define imaxDKey 12

static char *rgszDKey[imaxDKey] = {
    "CTL",
    "STATCTL", "LTEXT", "RTEXT", "CTEXT", "RECTITEM",
    "CHECKBOX", "PUSHBUTTON", "RADIOBUTTON",
    "EDITCTL", "EDITITEM"
};

int fnDlg3(), fnDlg1();

static int (*rgpfnDKey[imaxDKey])() = {
    fnDlg3,
    fnDlg3, fnDlg3, fnDlg3, fnDlg3, fnDlg1,
    fnDlg3, fnDlg3, fnDlg3,
    fnDlg3, fnDlg1
};

static  FILE    *pfResIn,               /* Input resource script file */
                *pfResOut;              /* resource script output */
static  FILE    *pfMenu;                /* include file output */


static  char szLine[256];               /* line buffer */
static  PL plLine;                      /* parsed line */

#define istMax 500
#define ichMax 10000
static char *rgszST[istMax];		/* symbol table */
static char rgchST[ichMax];
int istMac = 1;
int ichMac = 0; 

/*----------------------------------------------------------------------------
   "Some people, they like to go our dancing, and other people
   [like main], they do all the work . . ."
----------------------------------------------------------------------------*/

main (argc, argv)
int argc;
char *argv[];
{
    char ch;
    char *pchResIn, *pchResOut; /* pointers to file names */
    char szResIn[64], szResOut[64]; /* file names */
    BOOL fExt;                  /* used to flag presence of filename extensio */
    int ikey;

/* open input resource script, output resource script, and menu.h */

    if (argc < 2) panic(1);
    pchResIn = argv[1]; pchResOut = szResIn; fExt = FALSE;
    while (*pchResOut++ = *pchResIn++)
        if (*(pchResIn - 1) == '.') {
            fExt = TRUE;
            *(pchResIn - 1) = '\0';
        }
    if (!fExt) strcat(szResIn, ".rci");
    pchResIn = (argc < 3) ? argv[1] : argv[2];
    pchResOut = szResOut; fExt = FALSE;
    while (*pchResOut++ = *pchResIn++)
        if (*(pchResIn - 1) == '.') fExt = TRUE;
    if (!fExt) strcat(szResOut, ".rc");
    if ((pfResIn = fopen(szResIn, "r")) == NULL) panic(2);
    if ((pfResOut = fopen(szResOut, "w")) == NULL) panic(2);
    if ((pfMenu = fopen("menu.h", "w")) == NULL) panic(2);

/* Main loop: scan through lines of the input file */

    while (fgets(szLine, 255, pfResIn)) {
        parseline(szLine, &plLine);
        if (plLine.cItem == 0) continue;
        if (plLine.cItem == 1) panic(7);
        for (ikey = 0; ikey < imaxKey; ikey++) {
            if (matchid(&plLine, 1, rgszKey[ikey])) {
                (*rgpfnKey[ikey])(&plLine);
                goto tag;
            }
        }
        panic(5);
tag:;
    }
}


/*---------------------------------------------------------------------------
    Routine that takes a line from the input file and parses it into
    separate words that can be manipulated reasonably by other subroutines.
---------------------------------------------------------------------------*/

parseline (pch, ppl)
char *pch;
PL *ppl;
{
    ppl->cItem = 0;
    ppl->pch = ppl->rgch;
    while (*pch)
        parseitem(&pch, ppl);
}

parseitem (ppch, ppl)
char **ppch;
PL *ppl;
{
    char ch;

    while (member(ch = **ppch, " \t\n"))
        (*ppch)++;
    if (ch == '\0')
        return;
    if (ch == '"')
        parsestring(ppch, ppl);
    else if (member(ch, "0123456789"))
        parsenumber(ppch, ppl);
    else if (ch == ',')
        parsecomma(ppch, ppl);
    else if (ch == ';') {
        while ((ch = *(*ppch)++) && (ch != '\n'));
    } else
        parseid(ppch, ppl);
}

parsestring (ppch, ppl)
char **ppch;
PL *ppl;
{
    char ch;

    ppl->rgtyItem[ppl->cItem] = TYSTRING;
    (char *)(ppl->rgItem[ppl->cItem++]) = ppl->pch;
    *(*ppch)++;
    while ((ch = *(*ppch)++) && ch != '"')
        *(ppl->pch)++ = ch;
    if (ch) {
        *(ppl->pch)++ = '\0';
        return;
    }
    panic(6);
}


parsenumber (ppch, ppl)
char **ppch;
PL *ppl;
{
    int n = 0;
    char ch;

    ppl->rgtyItem[ppl->cItem] = TYNUMBER;
    while (member(ch = **ppch, "0123456789")) {
        n = 10 * n + ch - '0';
        (*ppch)++;
    }
    (int)(ppl->rgItem[ppl->cItem++]) = n;
}


parseid (ppch, ppl)
char **ppch;
PL *ppl;
{
    char ch;

    ppl->rgtyItem[ppl->cItem] = TYID;
    (char *)(ppl->rgItem[ppl->cItem++]) = ppl->pch;
    while (!member(ch = **ppch, " \t\n,")) {
        if (ch == '\0') break;
        *(ppl->pch)++ = ch;
        (*ppch)++;
    }
    *(ppl->pch)++ = '\0';
}

parsecomma (ppch, ppl)
char **ppch;
PL *ppl;
{
    if (ppl->cItem && ppl->rgtyItem[ppl->cItem - 1] == TYCOMMA)
        ppl->rgtyItem[ppl->cItem++] = TYNULL;
    ppl->rgtyItem[ppl->cItem++] = TYCOMMA;
    (*ppch)++;
}


/*----------------------------------------------------------------------------
    Here follows the various parse routines for the major keys.
----------------------------------------------------------------------------*/

int fnIt (ppl)
PL *ppl;
{
    PL plLine;
    char szLine[256];

    writepl(pfResOut, ppl);
    if (fgets(szLine, 255, pfResIn) == 0)
        panic(3);
    parseline(szLine, &plLine);
    if (!matchid(&plLine, 0, "begin"))
        panic(3);
    writepl(pfResOut, &plLine);
    do {
        if (fgets(szLine, 255, pfResIn) == 0)
            panic(3);
        parseline(szLine, &plLine);
        writepl(pfResOut, &plLine);
    } while (!matchid(&plLine, 0, "end"));
}

int fnCursor (ppl)
PL *ppl;
{
    writepl(pfResOut, ppl);
}

int fnIcon (ppl)
PL *ppl;
{
    writepl(pfResOut, ppl);
}

int fnBitmap (ppl)
PL *ppl;
{
    writepl(pfResOut, ppl);
}

int fnPfont (ppl)
PL *ppl;
{
    writepl(pfResOut, ppl);
}

int fnDialog (ppl)
PL *ppl;
{
    PL plLine;
    char szLine[256];
    int index = 1, ikey;

    fprintf(pfMenu, "\n/* Dialog %s */\n", (char *)(ppl->rgItem[0]));
    writepl(pfResOut, ppl);
    do {
        if (fgets(szLine, 255, pfResIn) == 0) panic(3);
        parseline(szLine, &plLine);
        if ((matchid(&plLine, 0, "options")) ||
                matchid(&plLine, 0, "caption") ||
                matchid(&plLine, 0, "menuname") ||
                matchid(&plLine, 0, "begin"))
            writepl(pfResOut, &plLine);
        else panic(7);
    } while (!matchid(&plLine, 0, "begin"));
    do {
        if (fgets(szLine, 255, pfResIn) == 0) panic(3);
        parseline(szLine, &plLine);
        for (ikey = 0; ikey < imaxDKey; ikey++)
            if (matchid(&plLine, 0, rgszDKey[ikey])) {
                (*rgpfnDKey[ikey])(&plLine, &index);
                break;
            }
    } while (!matchid(&plLine, 0, "end"));
    writepl(pfResOut, &plLine);
}

int fnDlgN (ppl, n)
PL *ppl;
int n;
{
    int index;

    if (ppl->rgtyItem[n] == TYID) {
	if (!(index = lookup((char *)ppl->rgItem[n])))
	    index = enter((char *)ppl->rgItem[n]);
        fprintf(pfMenu, "#define IDD%s %d\n", (char *)(ppl->rgItem[n]), index);
	ppl->rgtyItem[n] = TYNUMBER;
	(int)(ppl->rgItem[n]) = index;
    }
    else if (ppl->rgtyItem[n] != TYNUMBER) {
        ppl->rgtyItem[n] = TYNUMBER;
        (int)(ppl->rgItem[n]) = -1; 
    }
    writepl(pfResOut, ppl);
}

int fnDlg3 (ppl)
PL *ppl;
{
    fnDlgN(ppl, 3);
}

int fnDlg1 (ppl)
PL *ppl;
{
    fnDlgN(ppl, 1);
}

int fnMenu (ppl)
PL *ppl;
{
    PL plLine;
    char szLine[256];
    int iPopup = 0;
    int iMenuitem = 256;

    writepl(pfResOut, ppl);
    fprintf(pfMenu, "\n/* Menu %s */\n", (char *)(ppl->rgItem[0]));
    if (fgets(szLine, 255, pfResIn) == 0) panic(3);
    parseline(szLine, &plLine);
    if (!matchid(&plLine, 0, "begin")) panic(4);
    writepl(pfResOut, &plLine);
    do {
        if (fgets(szLine, 255, pfResIn) == 0) panic(3);
        parseline(szLine, &plLine);
        if (matchid(&plLine, 0, "menuitem")) {
            fnMenuitem(&plLine, &iMenuitem, -1);
        } else if (matchid(&plLine, 0, "popup")) {
            fnPopup(&plLine, iPopup, &iMenuitem);
        }
	iPopup++;
    } while (!matchid(&plLine, 0, "end"));
    writepl(pfResOut, &plLine);
}


fnMenuitem (ppl, piMenuitem, iFirst)
PL *ppl;
int *piMenuitem, iFirst;
{
    if (ppl->rgtyItem[3] == TYID) {
        if (iFirst > 0)
            fprintf(pfMenu, "#define %s %d\n", (char *)(ppl->rgItem[3]),
                    *piMenuitem - iFirst);
        fprintf(pfMenu, "#define IDM%s %d\n", (char *)(ppl->rgItem[3]), *piMenuitem);
    }
    if (ppl->rgtyItem[3] == TYID || ppl->rgtyItem[3] == TYNULL) {
        ppl->rgtyItem[3] = TYNUMBER;
        (int)(ppl->rgItem[3]) = *piMenuitem;
    }
    writepl(pfResOut, ppl);
    (*piMenuitem)++;
}


fnPopup (ppl, iPopup, piMenuitem)
PL *ppl;
int iPopup, *piMenuitem;
{
    PL plLine;
    char szLine[256];
    int iFirst = *piMenuitem;

    if ((ppl->cItem < 2) || (ppl->rgtyItem[1] != TYSTRING))
        panic(5);
    fprintf(pfMenu, "/* Popup menu %s */\n", (char *)(ppl->rgItem[1]));
    writepl(pfResOut, ppl);
    Idize((char *)ppl->rgItem[1], szLine);
    fprintf(pfMenu, "#define %s %d\n", szLine, iPopup);
    fprintf(pfMenu, "#define IDP%s %d\n", szLine, iFirst);
    if (fgets(szLine, 255, pfResIn) == 0) panic(3);
    parseline(szLine, &plLine);
    if (!matchid(&plLine, 0, "begin")) panic(5);
    writepl(pfResOut, &plLine);
    do {
        if (fgets(szLine, 255, pfResIn) == 0) panic(3);
        parseline(szLine, &plLine);
        if (matchid(&plLine, 0, "menuitem"))
            fnMenuitem(&plLine, piMenuitem, iFirst);
        else
            writepl(pfResOut, &plLine);
    } while (!matchid(&plLine, 0, "end"));
}


writepl (pf, ppl)
FILE *pf;
PL *ppl;
{
    int item;

    for (item = 0; item < ppl->cItem; item++) {
        switch (ppl->rgtyItem[item]) {
            case TYID:
                fprintf(pf, "%s ", (char *)(ppl->rgItem[item]));
                break;
            case TYCOMMA:
                fprintf(pf, ",");
                break;
            case TYNUMBER:
                fprintf(pf, "%d ", (int)(ppl->rgItem[item]));
                break;
            case TYSTRING:
                fprintf(pf, "\"%s\" ", (char *)(ppl->rgItem[item]));
                break;
            default:
                fprintf(pf, "[error]");
                break;
        }
    }
    fprintf(pf, "\n");
}

/*----------------------------------------------------------------------------
    Symbol table manipulation routines.
----------------------------------------------------------------------------*/

int lookup (sz)
char *sz;
{
    int ist;

    for (ist = 1; ist < istMac; ist++) {
	if (equal(sz, rgszST[ist]))
	    return(ist);
    }
    return(0);
}

int enter (sz)
char *sz;
{
    rgszST[istMac] = &rgchST[ichMac];
    do {
	if (ichMac == ichMax) panic(-1);
	rgchST[ichMac++] = *sz;
    } while (*sz++);
    return(istMac++);
}


/*----------------------------------------------------------------------------
    This routine takes a string and scrunches it into something that
    looks remotely like a legal C identifier.
----------------------------------------------------------------------------*/

Idize (sz1, sz2)
char *sz1, *sz2;
{
    char ch;

    while (ch = toupper(*sz1++))
        if (member(ch, "ABCDEFGHIJKLMNOPQRSTUVWXYZ_"))
            *sz2++ = ch;
    *sz2 = '\0';
}

/*----------------------------------------------------------------------------
    This subroutine returns true if the identifier in the parsed thing
    is the same as the given string.
----------------------------------------------------------------------------*/

BOOL matchid (ppl, iItem, sz)
PL *ppl;
int iItem;
char *sz;
{
    return(ppl->rgtyItem[iItem] == TYID &&
            equal(sz, (char *)(ppl->rgItem[iItem])));
}


/*----------------------------------------------------------------------------
    This subroutine returns true if the two given zero-terminated strings
    are equal.  Case is ignored in the comparison.
----------------------------------------------------------------------------*/

BOOL equal (sz1, sz2)
char *sz1, *sz2;
{
    char ch;

    while ((ch = toupper(*sz1++)) == toupper(*sz2++))
        if (ch == '\0') return(TRUE);
    return(FALSE);
}


/*----------------------------------------------------------------------------
    routine returns true if the character is an element in the given
    zero-terminated string.
----------------------------------------------------------------------------*/

BOOL member (ch, sz)
char ch;
char *sz;
{
    while (*sz)
        if (ch == *sz++) return(TRUE);
    return(FALSE);
}


/*----------------------------------------------------------------------------
   Our mad chicken-with-it's-head-cut-off error abort routine.
----------------------------------------------------------------------------*/

panic (err)
int err;
{
    switch (err) {
        case 1:
            fprintf(stderr, "\nmenuid is a pre-processor for the Microsoft\n");
            fprintf(stderr, "Windows rc resource compiler.  It replaces\n");
            fprintf(stderr, "identifiers in the 'id' fields with numbers\n");
            fprintf(stderr, "and sends a stream of C #define statements\n");
            fprintf(stderr, "to menu.h.\n");
            fprintf(stderr, "\nSee menuid.doc for additional information.\n");
            fprintf(stderr, "\nUsage:  menuid <rci file> [<rc file>]\n\n");
            break;
        case 2:
            fprintf(stderr, "Can't open file\n");
            break;
        case 3:
            fprintf(stderr, "Unexpected end of file\n");
            break;
        default:
            fprintf(stderr, "panic 0x%x\n", err);
            break;
    }
    exit(err);
}


/*----------------------------------------------------------------------------
   Converts the character to upper case
----------------------------------------------------------------------------*/

char toupper (ch)
char ch;
{
    if ((ch <= 'z') && (ch >= 'a')) return (ch & 0xdf);
    else return(ch);
}
