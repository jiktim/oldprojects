#include "windows.h"

extern int FAR PASCAL SampleCreate( HWND );
extern int FAR PASCAL SampleInput(HWND, int, RESULTBLOCK FAR *);
extern int FAR PASCAL SamplePaint( HWND, HDC, BOOL, LPRECT, LPINT );

extern HBRUSH   hbrWhite;
extern HBRUSH   hbrBlack;
extern HBRUSH   hbrGray;

/* Procedure called when the application is loaded
*/
FAR SampleInit()
{
    HANDLE      hRF;
    PWNDCLASS   pSampleClass;

    hbrWhite = GetStockObject( WHITE_BRUSH );
    hbrBlack = GetStockObject( BLACK_BRUSH );
    hbrGray  = GetStockObject( GRAY_BRUSH );

    pSampleClass = (PWNDCLASS) calloc( 1, sizeof( WNDCLASS ) );
    pSampleClass->lpClsName    = (LPSTR) "Sample";

        /* open the resource file for this application */
    if (hRF = OpenResourceFile( (LPSTR)"sample.res" )) {
        /* if the open was successful, get the resources */
        pSampleClass->hClsItTable = ItLoad( hRF,(LPSTR)"sample" );
        pSampleClass->hClsCursor  = CursorLoad( hRF, (LPSTR)"sample" );
        pSampleClass->hClsIconId  = IconLoad( hRF,(LPSTR)"sample" );
        CloseResourceFile( hRF );
        }

    pSampleClass->hBackBrush   = hbrWhite;

        /* The class chooses to reformat if the window becomes wider and
           not to reformat ie. have its contents saved if it merely becomes
           taller.
        */
    pSampleClass->vUpdate       = REDRAW;
    pSampleClass->hUpdate       = REDRAW;


        /* The class sets its procedures.
        */

    pSampleClass->clsWndCreate  = SampleCreate;
    pSampleClass->clsWndInput   = SampleInput;
    pSampleClass->clsWndPaint   = SamplePaint;

        /* register this new class with WINDOWS */
    if (!RegisterClass( (LPWNDCLASS)pSampleClass ) )
        return FALSE;   /* Initialization failed */

    free( (char *) pSampleClass );

    return TRUE;    /* Initialization succeeded */
}
