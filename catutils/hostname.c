/* hostname -- outputs or set hostname
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv) {
	if (argc > 1) {
		int shost = sethostname(argv[1], strlen(argv[1]) + 1);
		if (shost == -1) {
			puts("cannot edit hostname");
		}
		return 0;
	}
	char *hostname;
	hostname = malloc(34);
	gethostname(hostname, 34);
	if (hostname == NULL) {
		puts("cannot determine hostname");
		return 1;
	}
        puts(hostname);
	free(hostname);
        return 0;
}
