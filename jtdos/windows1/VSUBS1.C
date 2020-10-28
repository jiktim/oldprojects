/*      This file contains generally useful (and usually small) subroutines */
#include "windows.h"
#include "graph.h"

#define REGISTER    register
#define toupper(ch)     ((ch)&0337)
#define tolower(ch)     ((ch)|040)
#define low(ch)         ((ch)&0377)

/* ** Returns pointer to first occurence of character ch in string pch
      (whose length is cch), or 0 if ch does not appear */

CHAR *indexn(pch, cch, ch)
REGISTER CHAR *pch;
int cch;
int ch;
    {
    while (cch-->0)
        {
        if (low(*pch++) == ch)
            return(pch-1);
        }
    return((CHAR *)0);
    }

/* ** Returns pointer to first occurrence of character ch found in null-
      terminated string pch, or 0 if ch does not appear.  If ch==0, we
      return a pointer to the null terminator. */

CHAR *index(pch, ch)
REGISTER CHAR *pch;
REGISTER int ch;
    {
    while (low(*pch)!=ch)
        {
        if (*pch++=='\0')
            return((CHAR *)NULL);
        }
    return(pch);
    }

/* ** Returns TRUE if character ch appears in null-terminated string pch,
      FALSE otherwise */

member(pch, ch)
CHAR *pch;
REGISTER int ch;
    {
    return(ch!='\0' && (int)index(pch, ch)!= NULL);
    }

/* ** Returns TRUE if strings pch1 and pch2 are the same through cch
      characters, FALSE otherwise.  If fCase is set, an exact match is
      required; if not, upper and lower case are considered to be the same.
      Note that if fCase is not set, we are assumed to be matching only
      alphanumeric strings; this is because the case mapping is done for all
      characters, not just letters. */

strncmp(lpch1, lpch2, cch, fCase)
CHAR FAR *lpch1;
CHAR FAR *lpch2;
int cch;
BOOL fCase;
{
    int ch1, ch2;

    while (cch-- != 0) {
        ch1 = *lpch1++;
        ch2 = *lpch2++;
        if (!fCase) {
            if (islower(ch1))
                ch1 = toupper(ch1);
            if (islower(ch2))
                ch2 = toupper(ch2);
        }
        if (ch1 != ch2)
            return(FALSE);
    }
    return(TRUE);
}

BOOL islower(ch)
CHAR    ch;
{
    return (ch >= 'a' && ch <= 'z');
}

/* ** Stick cch instances of character ch into the buffer pointed to by lpch.
      Returns a pointer to the first byte after the inserted characters. */

CHAR FAR *FillBuf(lpch, cch, ch)
CHAR FAR *lpch;
int cch;
int ch;
{
    while (cch-- > 0)
        *lpch++ = ch;
    return(lpch);
}



isprint(ch)
REGISTER int ch;
    {
    return(ch>=' ' && ch<=0377);
    }

/* ** TRUE if ch is an MP operator, FALSE otherwise */

isoperator(ch)
int ch;
    {
    return(member((CHAR *)"+-^*/,&:<>=", ch));
    }

/* ** TRUE if ch is R, r, C, or c.  Useful for determining if something is
      a reference. */

isrc(ch)
int ch;
    {
    return(member((CHAR *)"RrCc", ch));
    }


/* ** Returns absolute value of SIGNED INTEGER argument x. */
int abs(x)
REGISTER int x;
{
    return((x > 0) ? x : -x);
}


int ncvtu(n, lplpch)
int n;
LPSTR FAR *lplpch;
{
    int cch;

    cch = 0;
    if (n < 0) {
        *(*lplpch)++ = '-';
        n = -n;
        ++cch;
    }
    if (n >= 10) {
        cch += ncvtu(n / 10, lplpch);
        n %= 10;
    }
    *(*lplpch)++ = '0' + n;
    return(cch + 1);
}


/* ** Convert signed integer i to ASCII string, producing sign if desired */

ncvts(i,lplpch, wantsign)
int i, wantsign;
LPSTR FAR *lplpch;
{
    LPSTR   lpchStart;

    lpchStart = *lplpch;
    if (wantsign) {
        /* produce sign */
        if (i > 0) {
            *(*lplpch)++ = '+';
        } else if (i < 0) {
            *(*lplpch)++ = '-';
            i = -i;
        }
    }
    ncvtu((unsigned)i, lplpch);
    return(*lplpch - lpchStart);
}

static char *rgchDigits = "0123456789abcdef";

int IDigitCh (ch)
{
    int ich;
    for (ich = 0; rgchDigits[ich] != ch; ich++)
        if (rgchDigits[ich] == '\0') return(-1);
    return(ich);
}

int ncvtsz (lpsz)
char FAR *lpsz;
{
    int n = 0;
    while (*lpsz) n = 10 * n + IDigitCh(*lpsz++);
    return(n);
}

isalpha(ch)
REGISTER int ch;
    {
    return(islower(ch)||isupper(ch));
    }

/* ** TRUE if ch is an uppercase letter, else FALSE */
isupper(ch)
REGISTER int ch;
    {
    return(ch>='A' && ch<='Z');
    }



isdigit(ch)
REGISTER int ch;
    {
    return(ch>='0' && ch<='9');
    }

/* ** TRUE if ch is a character or a digit, FALSE otherwise */
isalnum(ch)
REGISTER int ch;
    {
    return(isalpha(ch)||isdigit(ch));
    }
