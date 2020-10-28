/* yes -- spams input until program is closed, spams "y" if no input provided
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main (int argc, const char **argv) {
	char *y = "y";
	if (argc > 1) {
		y = malloc(argc + 1); // clear string
		for (int i = 0; i < argc; i++) strcpy(y, argv[i]);
        }
	// the magic of yes
	while (1) {
		puts(y); // yes
	}

	free(y);
}
