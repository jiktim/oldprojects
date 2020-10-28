
/* ** events.h - this file contains definitions for all input events
                 in accordance with input translation table (mp.it).
                 */

/* ** Mouse button bitmap definitions */
#define     EVTBITMB    0x40    /* mouse event  */
#define     EVTBITB2    0x20    /* button 2     */
#define     EVTBITB1    0x10    /* button 1     */
#define     EVTBITUP    0x08    /* button up    */
#define     EVTBITSHFT  0x04    /* shift key    */
#define     EVTBITCTL   0x02    /* control key  */

#define EVTMSMOVE    64       /* mouse move */
#define EVTCTLMOVE   66       /* control move */
#define EVTSHMOVE    68       /* shift move */
#define EVTCTLSHMOVE 70       /* control shift move */

#define EVTB1DN      80       /* button 1 down */
#define EVTB1UP      88       /* button 1 up  */
#define EVTB1SHFT    84       /* shift button 1 down */
#define EVTB1UPSHFT  92       /* shift button 1 up */
#define EVTB1CTL     82       /* control button 1 down */
#define EVTB1UPCTL   90       /* control button 1 up   */
#define EVTB1CTLSH   86       /* control shift button 1 down */
#define EVTB1UPCTLSH 94       /* control shift button 1 up   */

#define EVTB2DN      96       /* button 2 down */
#define EVTB2UP      104      /* button 2 up  */
#define EVTB2SHFT    100      /* shift button 2 down */
#define EVTB2UPSHFT  108      /* shift button 2 up */
#define EVTB2CTL     98       /* control button 2 down */
#define EVTB2UPCTL   106      /* control button 2 up   */
#define EVTB2CTLSH   102      /* control shift button 2 down */
#define EVTB2UPCTLSH 110      /* control shift button 2 up   */

#define EVTB1B2DN    112      /* double button (down) */


/* BitMask to mask out shift and contrl shift conditions */
/* (Also mask out lowest bit, even though it's not used yet. */
#define EVTGRBFCN   0xf8


/* ** Formula bar entry */
#define EVTENTER    1

/* ** Click cancel button */
#define EVTCANCEL   2
