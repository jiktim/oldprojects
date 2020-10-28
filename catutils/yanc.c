/*
yanc - multi-platform lightweight C flexer for screenshots
[yet another neofetch clone]


by cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <pwd.h>
#include <sys/types.h>
#include <sys/utsname.h>

void printOS() {
	// TODO: get distro somehow
}

void printHNWU() {
	uid_t uid = geteuid();
	struct passwd *pw = getpwuid(uid);
	char *hostname;
	hostname = malloc(34);
	gethostname(hostname, 34);
	printf("%s@%s\n", pw->pw_name, hostname);
}

int main() {
	printHNWU();
	printOS();
	return 0;
}
