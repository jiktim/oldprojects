#define FALSE   0
#define TRUE    1
#define NULL    0

#define FAR     far
#define NEAR    near
#define LONG    long
#define VOID    void

typedef unsigned char   BYTE;
typedef unsigned short int WORD;
typedef int       BOOL;
typedef BOOL      BOOLEAN;
typedef char     *PSTR;
typedef char FAR *LPSTR;
typedef int  FAR *LPINT;

#define max(a,b)    ((a)>(b)?(a):(b))
#define min(a,b)    ((a)<(b)?(a):(b))
#define MAKELONG(a, b)  ((long)(((unsigned)a) | ((unsigned long)b) << 16))
#define LOWORD(l)       ((WORD)l)
#define HIWORD(l)       (*(((WORD *)&l) + 1))

/*
    Scroll commands
*/
#define LINEUP              0
#define LINEDOWN            1
#define PAGEUP              2
#define PAGEDOWN            3
#define LINELEFT            4
#define LINERIGHT           5
#define PAGELEFT            6
#define PAGERIGHT           7
#define VERTICALPOSITION    8
#define HORIZONTALPOSITION  9
#define TOPPERCENTAGE       10
#define LEFTPERCENTAGE      11

/*
    Focus commands
*/
#define SETFOCUS    0
#define KILLFOCUS   1
#define PUSHFOCUS   2
#define POPFOCUS    3

/*
    flags for class Icon procedure
*/
#define WINDOWCLOSE 0
#define WINDOWOPEN  1
#define ICONPAINT  -2

/*
    flags for class Destroy procedure
*/
#define WINDOWDESTROY 1
#define QUERYDESTROY  0

/*
    flags for ShowWindow
*/
#define HIDE_WINDOW 0
#define SHOW_OPENWINDOW 1
#define SHOW_ICONWINDOW 2

#define ERROR           0
#define NULLREGION      1
#define SIMPLEREGION    2
#define COMPLEXREGION   3

/*
    for paints
*/
#define         TOP         0
#define         LEFT        0
#define         BOTTOM      1
#define         RIGHT       1
#define         REDRAW      1


/*
    binary raster ops
*/
#define R2_BLACK            1               /*  0       */
#define R2_NOTMERGEPEN      2               /* DPon     */
#define R2_MASKNOTPEN       3               /* DPna     */
#define R2_NOTCOPYPEN       4               /* PN       */
#define R2_MASKPENNOT       5               /* PDna     */
#define R2_NOT              6               /* Dn       */
#define R2_XORPEN           7               /* DPx      */
#define R2_NOTMASKPEN       8               /* DPan     */
#define R2_MASKPEN          9               /* DPa      */
#define R2_NOTXORPEN       10               /* DPxn     */
#define R2_NOP             11               /* D        */
#define R2_MERGENOTPEN     12               /* DPno     */
#define R2_COPYPEN         13               /* P        */
#define R2_MERGEPENNOT     14               /* PDno     */
#define R2_MERGEPEN        15               /* DPo      */
#define R2_WHITE           16               /*  1       */


/*
    ternary raster operations
*/

#define SRCCOPY     0x00CC0020  /*dest=source                       */
#define SRCPAINT    0x00EE0086  /*dest=source OR dest               */
#define SRCAND      0x008800C6  /*dest=source AND   dest            */
#define SRCINVERT   0x00660046  /*dest= source XOR      dest        */
#define SRCERASE    0x00440328  /*dest= source AND (not dest )      */
#define NOTSRCCOPY  0x00330008  /*dest= (not source)                */
#define NOTSRCERASE 0x001100A6  /*dest= (not source) AND (not dest) */
#define MERGECOPY   0x00C000CA  /*dest= (source AND pattern)        */
#define MERGEPAINT  0x00BB0226  /*dest= (source AND pattern) OR dest*/
#define PATCOPY     0x00F00021  /*dest= pattern                     */
#define PATPAINT    0x00FB0A09  /*DPSnoo                            */
#define PATINVERT   0x005A0049  /*dest= pattern XOR     dest        */
#define DSTINVERT   0x00550009  /*dest= (not dest)                  */
#define BLACKNESS   0x00000042  /*dest= BLACK                       */
#define WHITENESS   0x00FF0062  /*dest= WHITE                       */

/* StretchBlt() modes */
#define BLACKONWHITE    1
#define WHITEONBLACK    2
#define COLORONCOLOR    3

/* PolyFill modes */
#define ALTERNATE       1
#define WINDING         2

#ifndef WIN_INTERNAL
typedef char *  HANDLE;
#endif

typedef HANDLE  * SPHANDLE;
typedef HANDLE  FAR * LPHANDLE;

typedef int ( FAR *  FARPROC )();
typedef int ( NEAR * NEARPROC )();
typedef unsigned LONG     DWORD;
typedef WORD ATOM;
typedef HANDLE GLOBALHANDLE;
typedef HANDLE LOCALHANDLE;

typedef struct {
    short      bmType;
    short      bmWidth;
    short      bmHeight;
    short      bmWidthBytes;
    BYTE       bmPlanes;
    BYTE       bmBitsPixel;
    char FAR  *bmBits;
} BITMAP;
typedef BITMAP *PBITMAP;
typedef BITMAP FAR *LPBITMAP;

typedef HANDLE  HSTR;
typedef HANDLE  HICON;
typedef HANDLE  HDC;
typedef HANDLE  HMENU;
typedef HANDLE  HPEN;
typedef HANDLE  HFONT;
typedef HANDLE  HBRUSH;
typedef HANDLE  HBITMAP;
typedef HANDLE  HMARKER;
typedef HANDLE  HCURSOR;
typedef HANDLE  HRF;
typedef HANDLE  HRGN;

typedef struct{
        int     x;
        int     y;
}POINT;
typedef POINT *PPOINT;
typedef POINT FAR * LPPOINT;

#ifndef WIN_INTERNAL
typedef struct {
        int left,top;
        int right,bottom;
} RECT;
typedef RECT    *PRECT;                    /*Ptr to rectangle              */
typedef RECT    FAR * LPRECT;
#endif


/* for PostError */
#define WARNING     0   /* errcode */
#define MINOR_ERROR 1
#define FATAL_ERROR 2

#define IGNORE      0   /* user response */
#define RETRY       1
#define ABORT       2

/* for Data Interchange */
#define SUCCESS         0
#define NOFORMAT        1       /* unknown data format */
#define NOCOMMAND       2       /* unknown data command */
#define NODATAPROC      3       /* no class data proc - returned by ExchangeData() */
#define OTHERERRORS     4

#define PREREGCOMMANDS  9       /* pre-registered command count */
#define QUERYFORMAT     0       /* pre-registered commands */
#define SENDALL         1
#define SENDSELECTION   2
#define DELETEALL       3
#define DELETESELECTION 4
#define INSERTALL       5
#define INSERTSELECTION 6
#define APPENDALL       7
#define APPENDSELECTION 8

#define PREREGFORMATS   4       /* pre-registered format count */
#define TEXT_FORMAT     0       /* pre-registered formats */
#define BITMAP_FORMAT   1
#define SYLK_FORMAT     2
#define DIF_FORMAT      3

typedef struct {
        LPINT   DataFormats;                /* long pointer to format array */
        short   noOfFormats;                /* format count */
} DATAFORMATS;
typedef DATAFORMATS     *PDATAFORMATS;
typedef DATAFORMATS FAR *LPDATAFORMATS;

#ifndef WIN_INTERNAL
typedef struct{
        HANDLE          hClsItTable;
        LPSTR           lpClsName;
        HCURSOR         hClsCursor;
        HICON           hClsIconId;
        HBRUSH          hBackBrush;
        HMENU           hMenu;
        int             vOrigin;
        int             hOrigin;
        int             vUpdate;
        int             hUpdate;
        FARPROC         clsWndCreate;
        FARPROC         clsWndDestroy;
        FARPROC         clsWndIcon;
        FARPROC         clsWndPaint;
        FARPROC         clsWndSize;
        FARPROC         clsWndInput;
        FARPROC         clsWndFocus;
        FARPROC         clsWndScroll;
        FARPROC         clsWndData;
        FARPROC         clsWndHelp;
}WNDCLASS;
typedef WNDCLASS        * PWNDCLASS;
typedef WNDCLASS    FAR * LPWNDCLASS;
#endif

#ifndef WIN_INTERNAL
typedef HANDLE HWND;
#endif

typedef struct {
    HWND    hWnd;
    char    cmdLine[1];
}NEWPARMS;

typedef NEWPARMS      *PNEWPARMS;
typedef NEWPARMS  FAR *LPNEWPARMS;


/* Input Translation result block */
typedef struct {
    BYTE type;
    BYTE len;
    union {
        struct rs1 {
            char c[ 4 ];
        } charval;

        struct rs2 {
            unsigned n, n1;
        } numval;

        struct rs3 {
            unsigned x, y;
        } mouseval;

        struct rs4 {
            long time;
        } timeval;

        struct rs5 {
            char FAR *pState;
        } stateval;

        struct rs6 {
            char FAR *pStr;
        } strval;
    } resval;
} RESULTBLOCK;
typedef  RESULTBLOCK  *PRESULTBLOCK;
typedef  RESULTBLOCK  FAR *LPRESULTBLOCK;

/* input event result types */
#define ENDRESULT   0
#define MSCRDCODE   1
#define TIMECODE    2
#define KEYSTCODE   3
#define NUMCODE     4
#define CHARCODE    5
#define STRCODE     6
#define ASCIICODE   7


/* GDI logical objects */
/* Pel Array */
typedef struct {
        short int paXCount,
                  paYCount,
                  paXExt,
                  paYExt;
        BYTE      paRGBs;
} PELARRAY;
typedef PELARRAY        *PPELARRAY;
typedef PELARRAY    far *LPPELARRAY;


/* Logical Brush */
typedef struct {
        unsigned short int lbStyle;
        unsigned long int  lbColor;
        short int          lbHatch;
} LOGBRUSH;
typedef LOGBRUSH        *PLOGBRUSH;
typedef LOGBRUSH    far *LPLOGBRUSH;

/* A PATTERN and a LOGBRUSH are the same thing */
typedef LOGBRUSH     PATTERN;
typedef PATTERN     *PPATTERN;
typedef PATTERN FAR *LPPATTERN;


/* Logical Pen */
typedef struct {
        unsigned short int lopnStyle;
        POINT              lopnWidth;
        unsigned long int  lopnColor;
} LOGPEN;
typedef LOGPEN      *PLOGPEN;
typedef LOGPEN  far *LPLOGPEN;


/* Logical marker */
typedef struct {
        unsigned short int lmStyle;
        POINT              lmSize;
        unsigned long int  lmColor;
} LOGMARK;
typedef LOGMARK     *PLOGMARK;
typedef LOGMARK far *LPLOGMARK;


/* Logical Font */

#define LF_FACESIZE 32

typedef struct  {
        short int lfHeight;
        short int lfWidth;
        short int lfEscapment;
        short int lfOrientation;
        short int lfWeight;
        BYTE lfItalic;
        BYTE lfUnderline;
        BYTE lfStrikeOut;
        BYTE lfCharSet;
        BYTE lfOutPrecision;
        BYTE lfClipPrecision;
        BYTE lfQuality;
        BYTE lfPitch;
        BYTE lfFaceName[LF_FACESIZE];
} LOGFONT;
typedef LOGFONT     *PLOGFONT;
typedef LOGFONT far *LPLOGFONT;


/* Text Metric */
typedef struct {
        short int tmHeight;
        short int tmAscent;
        short int tmDescent;
        short int tmLeading;
        short int tmAveCharWidth;
        short int tmMaxCharWidth;
        short int tmWeight;
        BYTE      tmItalic;
        BYTE      tmUnderlined;
        BYTE      tmStruckOut;
        BYTE      tmFirstChar;
        BYTE      tmLastChar;
        BYTE      tmDefaultChar;
        BYTE      tmBreakChar;
        BYTE      tmPitch;
        BYTE      tmCharSet;
} TEXTMETRIC;
typedef TEXTMETRIC     *PTEXTMETRIC;
typedef TEXTMETRIC far *LPTEXTMETRIC;

#define RASTER_FONTTYPE             0x0001
#define DEVICE_FONTTYPE             0X0002

/* Logical font constants */

#define OUT_DEFAULT_PRECIS          0
#define OUT_STRING_PRECIS           1
#define OUT_CHARACTER_PRECIS        2
#define OUT_STROKE_PRECIS           3

#define CLIP_DEFAULT_PRECIS         0
#define CLIP_CHARACTER_PRECIS       1
#define CLIP_STROKE_PRECIS          2

#define DEFAULT_QUALITY             0
#define DRAFT_QUALITY               1
#define PROOF_QUALITY               2

#define DEFAULT_PITCH               0
#define FIXED_PITCH                 1
#define VARIABLE_PITCH              2


/* GDI rgb values packed into a dword */

#define RGB(r,g,b) (((unsigned long) (b << 8 | g) << 8) | r)
#define GetRValue(rgb) ((BYTE)rgb)
#define GetGValue(rgb) ((BYTE)(((WORD)rgb) >> 8))
#define GetBValue(rgb) ((BYTE)(rgb>>16))

/* GDI Background Modes */

#define TRANSPARENT         1
#define OPAQUE              2

/* GDI map modes */

#define ABSOLUTE            1
#define RELATIVE            2

/* Stock Logical Objects */

#define  WHITE_BRUSH    0
#define  LTGRAY_BRUSH   1
#define  GRAY_BRUSH     2
#define  DKGRAY_BRUSH   3
#define  BLACK_BRUSH    4
#define  HOLLOW_BRUSH   5
#define  WHITE_PEN      6
#define  BLACK_PEN      7
#define  NULL_PEN       8
#define  DOT_MARKER     9
#define  FIXED_FONT    10
#define  VAR_FONT      11

/* GDI Brush Style definitions. */

#define     BS_SOLID            0
#define     BS_HOLLOW           1
#define     BS_HATCHED          2
#define     BS_PATTERN          3

/* GDI Hatch Style definitions. */

#define     HS_HORIZONTAL       0       /* ----- */
#define     HS_VERTICAL         1       /* ||||| */
#define     HS_FDIAGONAL        2       /* ///// */
#define     HS_BDIAGONAL        3       /* \\\\\ */
#define     HS_CROSS            4       /* +++++ */
#define     HS_DIAGCROSS        5       /* xxxxx */

/* Device Parameters for GetDeviceCaps() */

#define DRIVERVERSION     0     /*  Device driver version                 */
#define TECHNOLOGY        2     /*  Device classification                 */
#define HORZSIZE          4     /*  Horizontal size in millimeters        */
#define VERTSIZE          6     /*  Vertical   size in millimeters        */
#define HORZRES           8     /*  Horizontal width in pixels            */
#define VERTRES           10    /*  Vertical   width in pixels            */
#define BITSPIXEL         12    /*  Number of bits per pixel              */
#define PLANES            14    /*  Number of planes                      */
#define NUMBRUSHES        16    /*  Number of brushes the device has      */
#define NUMPENS           18    /*  Number of pens the device has         */
#define NUMMARKERS        20    /*  Number of markers the device has      */
#define NUMFONTS          22    /*  Number of fonts the device has        */
#define PDEVICESIZE       24    /*  Size required for device descriptor   */
#define CURVECAPS         26    /*  Curves    capabilities                */
#define LINECAPS          28    /*  Line      capabilities                */
#define POLYGONALCAPS     30    /*  Polygonal capabilities                */
#define TEXTCAPS          32    /*  Text      capabilities                */
#define CLIPCAPS          34    /*  Clipping  capabilities                */
#define RASTERCAPS        36    /*  Bitblt    capabilities                */
#define ASPECTX           38    /*  Length of the X leg                   */
#define ASPECTY           40    /*  Length of the Y leg                   */
#define ASPECTXY          42    /*  Length of the hypotenuse              */

#ifndef PASCAL
#define PASCAL  pascal
#endif

/* GDI functions */
short   FAR PASCAL SetROP2(HDC, short);
short   FAR PASCAL GetROP2(HDC);
DWORD   FAR PASCAL SetColorTable(HDC, short, DWORD);
DWORD   FAR PASCAL GetColorTable(HDC, short);
short   FAR PASCAL SetMapMode(HDC, short);
short   FAR PASCAL GetMapMode(HDC);
short   FAR PASCAL SetBkMode(HDC, short);
short   FAR PASCAL GetBkMode(HDC);
short   FAR PASCAL SetRelAbs(HDC, short);
short   FAR PASCAL GetRelAbs(HDC, short);
DWORD   FAR PASCAL SetWindowOrg(HDC, short, short);
DWORD   FAR PASCAL GetWindowOrg(HDC);
DWORD   FAR PASCAL SetViewportOrg(HDC, short, short);
DWORD   FAR PASCAL GetViewportOrg(HDC);
DWORD   FAR PASCAL SetWindowExt(HDC, short, short);
DWORD   FAR PASCAL GetWindowExt(HDC);
DWORD   FAR PASCAL SetViewportExt(HDC, short, short);
DWORD   FAR PASCAL GetViewportExt(HDC);
DWORD   FAR PASCAL MoveTo(HDC, short, short);
DWORD   FAR PASCAL GetCurrentPosition(HDC);
BOOL    FAR PASCAL LPtoDP(HDC, LPPOINT, short);
BOOL    FAR PASCAL DPtoLP(HDC, LPPOINT, short);
BOOL    FAR PASCAL LPtoSP( HDC, LPPOINT, short);
BOOL    FAR PASCAL SPtoLP( HDC, LPPOINT, short);
DWORD   FAR PASCAL SetBkColor(HDC, DWORD);
DWORD   FAR PASCAL GetBkColor(HDC);
DWORD   FAR PASCAL SetTextColor(HDC, DWORD);
DWORD   FAR PASCAL GetTextColor(HDC);
HMARKER FAR PASCAL CreateMarkerIndirect(LOGMARK FAR *);
HPEN    FAR PASCAL CreatePenIndirect(LOGPEN FAR *);
HBRUSH  FAR PASCAL CreateBrushIndirect(LOGBRUSH FAR *);
HFONT   FAR PASCAL CreateFontIndirect(LOGFONT FAR *);
HBITMAP FAR PASCAL CreateBitmapIndirect(BITMAP FAR *);
HBITMAP FAR PASCAL CreateBitmap(short, short, BYTE, BYTE, LPSTR);
HBITMAP FAR PASCAL CreateCompatibleBitmap(HDC, short, short);
BOOL    FAR PASCAL DeleteObject(HANDLE);
HANDLE  FAR PASCAL SelectObject(HDC, HANDLE);
short   FAR PASCAL IntersectClipRect(HDC, short, short, short, short);
short   FAR PASCAL ExcludeClipRect(HDC, short, short, short, short);
short   FAR PASCAL GetClipBox(HDC, LPRECT);
HDC     FAR PASCAL CreateDC(LPSTR, LPSTR, LPSTR, LPSTR);
HDC     FAR PASCAL CreateMemoryDC(LPSTR, LPSTR, LPSTR, LPSTR);
HDC     FAR PASCAL CreateCompatibleDC ( HDC );
short   FAR PASCAL SaveDC(HDC);
BOOL    FAR PASCAL RestoreDC(HDC, short);
BOOL    FAR PASCAL DeleteDC(HDC);
short   FAR PASCAL GetDeviceCaps(HDC, short);
HANDLE  FAR PASCAL GetStockObject(short);
BOOL    FAR PASCAL PatBlt(HDC, short, short, short, short, DWORD);
BOOL    FAR PASCAL BitBlt(HDC, short, short, short, short, HDC, short, short, DWORD);
BOOL    FAR PASCAL StretchBlt(HDC, short, short, short, short, HDC, short, short, short, short, DWORD);
BOOL    FAR PASCAL TextOut(HDC, short, short, LPSTR, short);
DWORD   FAR PASCAL GetTextExtent(HDC, LPSTR, short);
BOOL    FAR PASCAL GetTextMetrics(HDC, TEXTMETRIC FAR *);
short   FAR PASCAL SetTextJustification(HDC, short, short);
short   FAR PASCAL SetTextCharacterExtra(HDC, short);
short   FAR PASCAL GetTextCharacterExtra(HDC);
short   FAR PASCAL GetTextFace(HDC, short, LPSTR);
short   FAR PASCAL EnumFonts(HDC, LPSTR, FARPROC, char FAR *);
long    FAR PASCAL GetBitmapBits(HBITMAP, long, LPSTR);
BOOL    FAR PASCAL SetBitmapBits(HBITMAP, DWORD, LPSTR);
short   FAR PASCAL GetObject(HANDLE, short, LPSTR);
HFONT   FAR PASCAL CreateFont(short, short, short, short, short, BYTE, BYTE, BYTE, BYTE, BYTE, BYTE, BYTE, BYTE, LPSTR);
HMARKER FAR PASCAL CreateMarker(short, short, short,DWORD);
HPEN    FAR PASCAL CreatePen(short, short,DWORD);
HBRUSH  FAR PASCAL CreateSolidBrush(DWORD);
HBRUSH  FAR PASCAL CreateHatchBrush(short,DWORD);
HBRUSH  FAR PASCAL CreatePatternBrush(HBITMAP);
BOOL    FAR PASCAL LineTo(HDC, short, short);
BOOL    FAR PASCAL Polyline(HDC, LPPOINT, short);
BOOL    FAR PASCAL StartPic(HDC);
BOOL    FAR PASCAL EndPic(HDC);
BOOL    FAR PASCAL ClearDevice(HDC);
BOOL    FAR PASCAL Escape(HDC, short, LPSTR, LPSTR);
HRGN    FAR PASCAL CreateRectRgn(HDC, short, short, short, short);
HRGN    FAR PASCAL CreateRectRgnIndirect(HDC, LPRECT);
HRGN    FAR PASCAL CreateEllipticRgn(HDC, short, short, short, short);
HRGN    FAR PASCAL CreateEllipticRgnIndirect(HDC, LPRECT);
HRGN    FAR PASCAL CreatePolygonRgn(HDC, short FAR *, short);
short   FAR PASCAL CombineRgn(HRGN, HRGN, HRGN, short);
short   FAR PASCAL OffsetRgn(HDC, HRGN, short, short);
short   FAR PASCAL OffsetClipRgn(HDC, short, short);
short   FAR PASCAL SelectClipRgn(HDC, HRGN);
BOOLEAN FAR PASCAL PtVisible(HDC, short, short);
BOOLEAN FAR PASCAL RectVisible(HDC, LPRECT);
BOOLEAN FAR PASCAL EqualRgn(HRGN, HRGN);

short   FAR PASCAL SetStretchBltMode( HDC, short);
short   FAR PASCAL GetStretchBltMode( HDC );
short   FAR PASCAL SetPolyFillMode( HDC, short);
short   FAR PASCAL GetPolyFillMode( HDC );
DWORD   FAR PASCAL SetPixel( HDC, short, short, DWORD);
DWORD   FAR PASCAL GetPixel( HDC, short, short);
void    FAR PASCAL FloodFill( HDC, short, short, DWORD);
void    FAR PASCAL LineDDA(short, short, short, FARPROC, LPSTR);

BOOL    FAR PASCAL Polygon( HDC, LPPOINT, short);
BOOL    FAR PASCAL Ellipse(HDC, short, short, short, short);
BOOL    FAR PASCAL Rectangle(HDC, short, short, short, short);
BOOL    FAR PASCAL RoundRect(HDC, short, short, short, short, short, short);

/* Windows Functions */
short FAR PASCAL SetTimer(HWND, unsigned, FARPROC);
BOOL  FAR PASCAL KillTimer(HWND, short);

int FAR PASCAL SetCapture(HWND, HANDLE, FARPROC);
int FAR PASCAL ReleaseCapture(void);

HWND  FAR PASCAL GetFocus(void);
int   FAR PASCAL SetFocus(HWND, HANDLE, FARPROC);
int   FAR PASCAL PushFocus(HWND, HANDLE, FARPROC);
int   FAR PASCAL KillFocus(void);
int   FAR PASCAL PopFocus(void);

int FAR PASCAL CloseWindow(HWND);
int FAR PASCAL OpenIcon(HWND);

HANDLE FAR PASCAL RemoveProp(HWND, LPSTR);
HANDLE FAR PASCAL GetProp(HWND, LPSTR);
int    FAR PASCAL SetProp(HWND, LPSTR, HANDLE);
int    FAR PASCAL EnumProps(HWND, FARPROC);

int   FAR  PASCAL ClientToScreen(HWND, LPPOINT);
HWND  FAR  PASCAL ScreenToClient(LPPOINT);
BOOL  FAR  PASCAL IsIconic(HWND);
int   FAR  PASCAL GetClientRect(HWND, LPRECT);
HMENU FAR  PASCAL GetMenu(HWND);
HMENU FAR  PASCAL QuerySubMenu(HMENU, int);
int   FAR  PASCAL SetMenu(HWND, HMENU);
int   FAR  PASCAL SetScrollBars(HWND,BOOL,BOOL);
int   FAR  PASCAL GetName(HWND, int, LPSTR);
int   FAR  PASCAL SetName(HWND, LPSTR);
int   FAR  PASCAL SetDesiredHeight(HWND, int);
int   FAR  PASCAL NotifyWindow(HWND, int, RESULTBLOCK FAR *);
int   FAR  PASCAL PaintWindow(HWND, BOOL, LPRECT, LPINT);
int   FAR  PASCAL ScrollWindow(HWND, int, int, LPRECT);
int   FAR  PASCAL DrawVertThumb(HWND);
int   FAR  PASCAL DrawHorzThumb(HWND);
int   FAR  PASCAL SetScrollBars(HWND,BOOL,BOOL);

HWND FAR  PASCAL CreateWindow(LPSTR, LPSTR, BOOL, BOOL, BOOL, HMENU, int, int, HANDLE);
HWND FAR  PASCAL CreatePopUp(LPSTR, LPSTR, BOOL, BOOL, BOOL, BOOL , HMENU, int, int, int, int, HANDLE);
HWND FAR  PASCAL CreateChild(LPSTR, HWND, LPSTR, BOOL, BOOL, BOOL, BOOL, BOOL, int, int, int, int, HANDLE);
int  FAR  PASCAL MoveChild(HWND, HWND, int, int, int, int, BOOL);
BOOL FAR  PASCAL IsWindowVisible(HWND);
BOOL FAR  PASCAL BringChildToTop(HWND);
int  FAR  PASCAL ShowWindow(HWND, BOOL);
int  FAR  PASCAL EnableWindow(HWND,BOOL);
BOOL FAR  PASCAL IsWindowEnabled(HWND);
int  FAR  PASCAL EnumChildWindows(HWND, FARPROC);

BOOL FAR  PASCAL AnyPopup(void);
BOOL FAR  PASCAL DestroyWindow(HWND);
HWND FAR  PASCAL FindWindow(LPSTR);
HWND FAR  PASCAL FindParent(HWND);
int  FAR  PASCAL EnumWindows(FARPROC);

BOOL FAR PASCAL RegisterClass(LPWNDCLASS);

HMENU FAR PASCAL CreateMenu(void);
int   FAR PASCAL DestroyMenu(HMENU);
int   FAR PASCAL AddMenuString(HMENU, int, LPSTR, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL AppendMenuString(HMENU, LPSTR, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL AddMenuBitmap(HMENU, int, HBITMAP, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL AppendMenuBitmap(HMENU, HBITMAP, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL NewMenuString(HMENU, int, LPSTR, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL NewMenuBitmap(HMENU, int, HBITMAP, WORD, BOOL, BOOL, BOOL, BOOL);
int   FAR PASCAL CheckMenuItem(HMENU, int, BOOL);
int   FAR PASCAL EnableMenuItem(HMENU, int, int);

HDC FAR PASCAL GetDC(HWND);
int FAR PASCAL ReleaseDC(HWND, HDC);

int  FAR PASCAL SetRect(LPRECT, int, int, int, int);
int  FAR PASCAL SetRectEmpty(LPRECT);
int  FAR PASCAL CopyRect(LPRECT, LPRECT);
BOOL FAR PASCAL IsRectEmpty(LPRECT);
BOOL FAR PASCAL PtInRect(LPRECT, LPPOINT);
int  FAR PASCAL OffsetRect(LPRECT, int, int);
int  FAR PASCAL InflateRect(LPRECT, int, int);
int  FAR PASCAL IntersectRect(LPRECT, LPRECT, LPRECT);
int  FAR PASCAL UnionRect(LPRECT, LPRECT, LPRECT);
int  FAR PASCAL FillRect(HDC, LPRECT, HBRUSH);
int  FAR PASCAL InvertRect(HDC, LPRECT);
int  FAR PASCAL FrameRect(HDC, LPRECT, HBRUSH);

int     FAR PASCAL SetCaret(HWND, HBITMAP,int, int);
BOOL    FAR PASCAL DestroyCaret(HWND);
BOOL    FAR PASCAL HideCaret(HWND);
BOOL    FAR PASCAL ShowCaret(HWND, int, int);

int     FAR PASCAL SetCursor(HCURSOR);
HICON   FAR PASCAL IconLoad(HANDLE, LPSTR);
int     FAR PASCAL DrawIcon(HDC, int, int, HICON);
long    FAR PASCAL IconSize(void);
HCURSOR FAR PASCAL CursorLoad(HANDLE, LPSTR);
HANDLE  FAR PASCAL ItLoad(HANDLE, LPSTR);
int     FAR PASCAL DragRect(LPRECT, int, int, FARPROC);

BOOL   FAR PASCAL RegisterDataFormat(LPSTR, LPINT);
BOOL   FAR PASCAL RegisterDataCommand(LPSTR, LPINT);
BOOL   FAR PASCAL GetDataFormatName(int, LPSTR, int);
BOOL   FAR PASCAL GetDataCommandName(int, LPSTR, int);
int    FAR PASCAL GetCommonDataFormat(HWND, HWND);
int    FAR PASCAL ExchangeData(HWND, int, int,HANDLE, LPHANDLE);
HWND   FAR PASCAL GetClipboardWnd( void );

void   FAR PASCAL PostError(LPSTR, int, FARPROC);
void   FAR PASCAL PostMessage(LPSTR, LPSTR, HMENU, FARPROC);


/* *************************** */


/* Exported procedures for KERNEL module */

void          far PASCAL FatalExit( int );
HANDLE        far PASCAL LoadModule( LPSTR, LPSTR );
void          far PASCAL FreeModule( HANDLE );
FARPROC       far PASCAL MakeProcInstance( FARPROC, HANDLE );
void          far PASCAL FreeProcInstance( FARPROC );
FARPROC       far PASCAL GetProcAddress(  HANDLE, LPSTR );
int           far PASCAL GetInstanceData( HANDLE, PSTR, int );
HANDLE        far PASCAL GetModuleHandle( LPSTR );

BOOL          far PASCAL InitAtomTable( int );
ATOM          far PASCAL FindAtom( LPSTR );
ATOM          far PASCAL AddAtom( LPSTR );
ATOM          far PASCAL DeleteAtom( ATOM );
WORD          far PASCAL GetAtomName( ATOM, LPSTR, int  );
HANDLE        far PASCAL GetAtomHandle( ATOM );

#define MAKEINTATOM(i)  (LPSTR)((unsigned long)((WORD)i))

HRF           far PASCAL OpenResourceFile( LPSTR );
BOOLEAN       far PASCAL CloseResourceFile( HANDLE );
HANDLE        far PASCAL FindResource( HANDLE, LPSTR, LPSTR );
HANDLE        far PASCAL LoadResource( HANDLE, HANDLE, LPSTR );
BOOLEAN       far PASCAL FreeResource( HANDLE );
int           far PASCAL AccessResource( HANDLE, HANDLE );
int           far PASCAL EnumResources( HANDLE, LPSTR, LPSTR, FARPROC, LPSTR );
unsigned long far PASCAL SizeofResource( HANDLE, HANDLE );

int   far PASCAL lstrcmp( LPSTR, LPSTR );
LPSTR far PASCAL lstrcpy( LPSTR, LPSTR );
LPSTR far PASCAL lstrcat( LPSTR, LPSTR );
int   far PASCAL lstrlen( LPSTR );
LPSTR far PASCAL lstrbscan( LPSTR, LPSTR );
LPSTR far PASCAL lstrbskip( LPSTR, LPSTR );

WORD far PASCAL _lclose( int );
WORD far PASCAL _lread( int, LPSTR, int );
WORD far PASCAL _lcreat( LPSTR, int );
LONG far PASCAL _llseek( int, long, int );
WORD far PASCAL _lopen( LPSTR, int );
WORD far PASCAL _lwrite( int, LPSTR, int );
WORD far PASCAL _ldelete( LPSTR );
WORD far PASCAL _ldup( int );

/* Scheduler functions */

HANDLE FAR PASCAL CreateTask( BYTE, WORD );
HANDLE FAR PASCAL StartTask( HANDLE, FARPROC );
BOOL   FAR PASCAL Yield( void );
BOOL   FAR PASCAL WaitEvent( HANDLE );
BOOL   FAR PASCAL PostEvent( HANDLE );
HANDLE FAR PASCAL GetCurrentTask( void );
BOOL   FAR PASCAL KillTask( HANDLE );

HANDLE far PASCAL ALLOC( WORD, unsigned long, WORD, BYTE );
HANDLE far PASCAL LOCALALLOC( WORD, WORD, WORD, BYTE );
HANDLE far PASCAL REALLOC( HANDLE, unsigned long, WORD, BYTE );
HANDLE far PASCAL LOCALREALLOC( HANDLE, WORD, WORD, BYTE );
LONG far PASCAL GETSIZE( HANDLE, BYTE );
WORD far PASCAL GETLOCALSIZE( HANDLE, BYTE );
LPSTR far PASCAL LOCKOBJECT( HANDLE, BYTE );
PSTR far PASCAL LOCKLOCALOBJECT( HANDLE, BYTE );
WORD far PASCAL UNLOCKOBJECT( HANDLE, BYTE );
WORD far PASCAL UNLOCKLOCALOBJECT( HANDLE, BYTE );
WORD far PASCAL FREE( HANDLE, BYTE );
WORD far PASCAL SWAP( HANDLE, BYTE );
BOOL far PASCAL ISSWAPPED( HANDLE, BYTE );
VOID far PASCAL LOCKDATA( void );
VOID far PASCAL UNLOCKDATA( void );

#define FIXED       0x00
#define MOVEABLE    0x02
#define LOCAL       0x00
#define GLOBAL      0x01
#define ZERO_INIT   0x40

#define ANONYOWNER   0xFFFF
#define ANONYTYPE    '\xFF'
#define IGNORETYPE   '\x0'

#ifndef Alloc
#define calloc(n,size)                      LOCALALLOC(ZERO_INIT,n*(size),ANONYOWNER,ANONYTYPE)
#define malloc(size)                        LOCALALLOC(0,size,ANONYOWNER,ANONYTYPE)
#define free(p)                             FREE(p,IGNORETYPE)
#define realloc(p,size)                     LOCALREALLOC(p,size,ANONYOWNER,IGNORETYPE)

#define Alloc(flags,size)                   ALLOC(flags,size,ANONYOWNER,ANONYTYPE)
#define LocalAlloc(flags,size)              LOCALALLOC(flags,size,ANONYOWNER,ANONYTYPE)
#define ReAlloc(handle,size,flags)          REALLOC(handle,size,flags,IGNORETYPE)
#define LocalReAlloc(handle,size,flags)     LOCALREALLOC(handle,size,flags,IGNORETYPE)
#define GetSize(handle)                     GETSIZE(handle,IGNORETYPE)
#define GetLocalSize(handle)                GETLOCALSIZE(handle,IGNORETYPE)
#define LockObject(handle)                  LOCKOBJECT(handle,IGNORETYPE)
#define UnlockObject(handle)                UNLOCKOBJECT(handle,IGNORETYPE)
#define LockLocalObject(handle)             LOCKLOCALOBJECT(handle,IGNORETYPE)
#define UnlockLocalObject(handle)           UNLOCKLOCALOBJECT(handle,IGNORETYPE)
#define Free(handle)                        FREE(handle,IGNORETYPE)
#define Swap(handle)                        SWAP(handle,IGNORETYPE)
#define IsSwapped(handle)                   ISSWAPPED(handle,IGNORETYPE)
#endif

int FAR PASCAL GetProfileInt( LPSTR, LPSTR, int );
BOOLEAN FAR PASCAL GetProfileBoolean( LPSTR, LPSTR, BOOLEAN );
int FAR PASCAL GetProfileString( LPSTR, LPSTR, LPSTR, LPSTR, int );
void FAR PASCAL WriteProfileString( LPSTR, LPSTR, LPSTR );

/* pushpull converter */
HANDLE FAR PASCAL CreatePushPull(FARPROC,int);
void   FAR PASCAL DestroyPushPull(HANDLE);
void   FAR PASCAL SaveEvent(HANDLE,LPRESULTBLOCK);
BOOL   FAR PASCAL PeekNextEvent(HANDLE,LPRESULTBLOCK);
void   FAR PASCAL GetNextEvent(HANDLE,LPRESULTBLOCK);

/* memory manager constants */

#define GHND        MOVEABLE+GLOBAL+ZERO_INIT
#define GPTR        FIXED+GLOBAL+ZERO_INIT
#define LHND        MOVEABLE+LOCAL+ZERO_INIT
#define LPTR        FIXED+LOCAL+ZERO_INIT
#define NONZEROLHND MOVEABLE+LOCAL
#define NONZEROLPTR FIXED+LOCAL
#define DONTCARE    0x10

#define READ        0
#define WRITE       1
#define READ_WRITE  2

/* Control manager structures & definitions */

typedef struct {
    HWND hwndParent;
    LPSTR lpszClass;
    LPSTR lpszText;
    unsigned style;
    int ID;
    int x, y;
    int cx, cy;
    BOOL bBorder;
    BOOL bVisible;
    BOOL bOverlap;
    BOOL bHScroll;
    BOOL bVScroll;
} CTLDEF;
typedef CTLDEF     *PCTLDEF;
typedef CTLDEF far *LPCTLDEF;

#define CMBIT           0x4000
#define CMCREATE        0x4000
#define CMSETTEXT       0x4001
#define CMGETTEXT       0x4002
#define CMGETTEXTLENGTH 0x4003
#define CMSETREDRAW     0x4004
#define CMENABLE        0x4005
#define CMGETCODE       0x4006
#define CMMESSAGE       0x4010

BOOL far PASCAL InitCtlMgr(void);
BOOL far PASCAL RegisterCtlClass(LPSTR);
HWND far PASCAL CreateCtl(LPCTLDEF);
long far PASCAL CtlMsg0(HWND, int);
long far PASCAL CtlMsg1(HWND, int, int);
long far PASCAL CtlMsg2(HWND, int, long);
long far PASCAL CtlMsg3(HWND, int, long, int);
BOOL far PASCAL SetCtlText(HWND, LPSTR);
int  far PASCAL GetCtlText(HWND, LPSTR, int);
int  far PASCAL GetCtlTextLength(HWND);
void far PASCAL CheckButton(HWND, BOOL);
BOOL far PASCAL IsButtonChecked(HWND);
int  far PASCAL EnableCtl(HWND, BOOL);

#define GetCtlCode(hwnd)            (int)CtlMsg0(hwnd, CMGETCODE - CMMESSAGE)
#define SetCtlRedraw(hwnd, fRedraw) CtlMsg1(hwnd, CMSETREDRAW - CMMESSAGE, fRedraw)
#define DestroyCtl(hwnd)            DestroyWindow(hwnd)
#define SetCtlFocus(hwnd)           SetFocus(hwnd, NULL, (LPSTR)NULL)
#define GetCtlFocus()               GetFocus()
#define MoveCtl(hwndCtl, hwndParent, x, y, cx, cy, fRedraw)  MoveChild(hwndCtl, hwndParent, x, y, cx, cy, fRedraw)
#define ShowCtl(hwndCtl, fShow)         ShowWindow(hwndCtl, (fShow ? SHOW_OPENWINDOW : HIDE_WINDOW))
#define IsCtlVisible(hwndCtl)           IsWindowVisible(hwndCtl)
#define IsCtlEnabled(hwndCtl)           IsWindowEnabled(hwndCtl)

/* Edit control class stuff */

/* style bits */
#define ELEFT           0
#define ECENTER         1
#define ERIGHT          2
#define EFRAMED         4
#define ENOTEFOCUS      8
#define ENOCHANGE       16
#define ENOTECLICK      32

/* notification codes */
#define ENCHAR       0
#define ENSETFOCUS   1
#define ENKILLFOCUS  2
#define ENCLICK      3

/* control messages: */
#define EMGETSEL        0
#define EMSETSEL        1
#define EMGETRECT       2
#define EMSETRECT       3
#define EMSETRECTNP     4
#define EMSCROLL        5
#define EMLINESCROLL    6
#define EMSETNOTECHARS  7
#define EMGETMODIFY     8
#define EMSETMODIFY     9
#define EMGETLINECOUNT  10
#define EMLINEINDEX     11

#define SetEditSel(hwnd, ichMin, ichMax)    CtlMsg2(hwnd, EMSETSEL, MAKELONG(ichMin, ichMax))
#define GetEditSel(hwnd)                    CtlMsg0(hwnd, EMGETSEL)

/* button control stuff */
#define BPUSHBUTTON     0
#define BCHECKBOX       1
#define BRADIOBUTTON    2
#define BUSERBUTTON     3

/* user button notification codes */
#define BNCLICKED       0
#define BNPAINT         1
#define BNHILITE        2
#define BNUNHILITE      3
#define BNDISABLE       4

/* control messages */
#define BMGETCHECK      0
#define BMSETCHECK      1
#define BMGETSTATE      2
#define BMSETSTATE      3

/* Static control stuff */

#define SLEFT   0
#define SCENTER 1
#define SRIGHT  2
#define SICON   3
#define SBLACKRECT  4
#define SGRAYRECT   5
#define SWHITERECT  6
#define SBLACKFRAME 7
#define SGRAYFRAME  8
#define SWHITEFRAME 9
#define SUSERITEM   10

/* Dialog manager stuff */

void far PASCAL InitDlgMgr(HANDLE, HANDLE);
HWND far PASCAL CreateDlg(HWND, int (far *)(), HANDLE, LPSTR);
HWND far PASCAL GetDlgItem(HWND, int);
BOOL far PASCAL SetDlgItemText(HWND, int, LPSTR);
int  far PASCAL GetDlgItemText(HWND, int, LPSTR, int);
long far PASCAL DlgItemMsg0(HWND, int, int);
long far PASCAL DlgItemMsg1(HWND, int, int, int);
long far PASCAL DlgItemMsg2(HWND, int, int, long);
long far PASCAL DlgItemMsg3(HWND, int, int, long, int);
void far PASCAL CheckDlgButton(HWND, int, BOOL);
BOOL far PASCAL IsDlgButtonChecked(HWND, int);

#define DestroyDlg(hwndDlg)             DestroyWindow(hwndDlg)
#define ShowDlg(hwndDlg, fShow)         ShowWindow(hwndDlg, (fShow ? SHOW_OPENWINDOW : HIDE_WINDOW))

/* Conventional item IDs */
#define IDINIT   0
#define IDOK     1
#define IDCANCEL 2

/* Menu loader stuff */

HMENU far PASCAL MenuLoad(HANDLE, LPSTR);
