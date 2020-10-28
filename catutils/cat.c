/* cat -- read stdin/file
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <stdio.h>
#include <unistd.h>
#include <stdbool.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <string.h>
#include <getopt.h>


bool showLines = false;
bool dollarLines = false;
bool showTabs = false;
bool squeezeBlank = true;

int readStdin() {
	char z;
	int sc = 1;
	int ft = true;
	while (read(0, &z, 1) > 0) {
		if (showLines) {
			// do it only once every line
			if (ft) {
                        	printf("     %d  ", sc);
                        	sc++;
				ft = false;
                	}

			if (z == '\n') {
				ft = true;
			}
		}

		if (dollarLines) {
			if (z == '\n') putchar('$');
		}

		if (showTabs) {
			if (z == '\t') printf("^I");
		}

		if (showTabs) {
			if (z != '\t') {
				putchar(z);
                	}
		} else {
			putchar(z);
		}
	}
        return 0;
}

void readFile(char *filename) {
        FILE *file;
	file = fopen(filename, "r");
        if (file) {
		int v = 1, j = 1;
		int lineLength = 0;
        	int c = getc(file);
		int line, ll;
		int lines = 2, k = 0;
		if (showLines) {
			while (line != EOF) {
 			        line = fgetc(file);
  				if (line == '\n') {
   					lines++;
  				}
			}
			rewind(file);
			ll = snprintf(NULL, 0, "%d", lines);
		}

        	while (c != EOF) {
			if (showLines) {
				if (j == 1 || j == 0) {
					int u = snprintf(NULL, 0, "%d", v);
					int lu = ll - u;
					if (lu > 0) {
						printf("%*s", lu, " ");
					}

					if (lu < 10) {
						lu--;
					}

					printf("%d", v);
					printf("%*s   ", lu, " ");
					// printf("%d %.*s     ", v, lu, " ");
				}

				if (c == '\n') {
					j = 0;
					v++;
				}
			}

			if (dollarLines) {
				if (c == '\n') putchar('$');
			}

			if (showTabs) {
				if (c == '\t') printf("^I");
			}

			if (showLines) {
				if (k > 0 || c == '\n') putchar(c);
			} else {
			 	if (showTabs) {
					if (c != '\t') {
						putchar(c);
					}
				} else {
					putchar(c);
				}
			}

			k++;
			j++;
			c = getc(file);
		}

                fclose(file);
        } else {
		printf("cat: %s: No such file or directory\n", filename);
	}
}

int isDir(const char *path) {
	struct stat dirst;
	if (!stat(path, &dirst) == 0) return 0;
	return S_ISDIR(dirst.st_mode);
}

static struct option l_opts[] = {
    {"number-nonblank", no_argument, NULL, 'b'},
    {"number", no_argument, NULL, 'n'},
    {"squeeze-blank", no_argument, NULL, 's'},
    {"show-nonprinting", no_argument, NULL, 'v'},
    {"show-ends", no_argument, NULL, 'E'},
    {"show-tabs", no_argument, NULL, 'T'},
    {"show-all", no_argument, NULL, 'A'}
};

int main(int argc, char **argv) {
	bool is_reading_stdin = true;
	if (argc > 1) is_reading_stdin = false;
	if (is_reading_stdin) readStdin();
	// read files provided in argv
	int arg;
	while ((arg = getopt_long(argc, argv, "benstuvAET", l_opts, NULL)) != -1) {
		switch (arg) {
			case 'n':
				showLines = true;
				break;

			case 'e':
				dollarLines = true;
				break;

			case 't':
				showTabs = true;
				break;

			default:
				printf("ha");
		}
	}

	while (argc > optind) {
		if (strcmp("-", argv[optind]) == 0) {
			readStdin();
		} else {
			if (isDir(argv[optind]) == 0) {
				readFile(argv[optind]);
			} else {
				printf("cat: %s: Is a directory\n", argv[optind]);
			}
		}
		optind++;
	}
	return 0;
}
