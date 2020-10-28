/* whoami -- who are you? responds your username
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

#include <stdio.h>
#include <pwd.h>
#include <sys/types.h>
#include <unistd.h>

int main() {
	errno = 0;
	uid_t uid = geteuid();
	if (uid == -1) {
		puts("cannot get euid");
		return 1;
	}
	struct passwd *pw = getpwuid(uid);
	if (errno) {
		printf("cannot find name for user ID %lu", (unsigned long int) uid);
	}
	puts(pw->pw_name);
	return 0;
}
