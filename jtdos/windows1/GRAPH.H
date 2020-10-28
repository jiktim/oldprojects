/* chart.h */
typedef unsigned char CHAR;

/* debug aids */
#define     MAXCTLMSG   5
#define     MAXPSHBTN   5
#define     MAXCHKBOX   5
#define     MAXRADBTN   5

#define BINSIDE  0
#define BOUTSIDE 1
#define BTOP     2
#define BBOTTOM  3
#define BLEFT    4
#define BRIGHT   5

#define SUP         0       /* state = buttonup         */
#define SMV         1       /* state = move             */
#define SSTTOP      2       /* state = stretch top      */
#define SSTBOTTOM   3       /* state = stretch bottom   */
#define SSTLEFT     4       /* state = stretch left     */
#define SSTRIGHT    5       /* state = stretch right    */

StartMvSt   ( HWND, HWND, LPPOINT, LPPOINT, LPRECT );
ContinueMvSt( HWND, LPPOINT, LPPOINT, LPRECT, int );
FinishMvSt  ( HWND, HWND, LPPOINT, LPPOINT, LPRECT, int );
AdjustImage ( LPPOINT, LPPOINT, LPRECT, int );
ShowImage   ( HWND, LPRECT );
int Where( LPPOINT, LPRECT, int);
