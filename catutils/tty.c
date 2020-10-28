/* tty -- print the name of the terminal connected to standard input
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <unistd.h>
#include <stdbool.h>

int main (int argc, char **argv) {
        bool silent = false;
        int x;
        while ((x = getopt(argc, argv, "s")) != -1) {
                silent = true;
        }
        if (!isatty(STDIN_FILENO)) {
                if (!silent) printf("not a tty");
                return 1;
        }
        if (!silent) printf(ttyname(STDIN_FILENO));
        return 0;
}
