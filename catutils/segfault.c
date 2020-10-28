/* segfault -- intentionally triggers a segmentation fault
   Copyright (C) 2020 JIK, LLC.

   Written by: cth103 <cth103@free.fr>
*/

int main() {
	char *buf = "jik";
	*buf = (char) "tim";
	return 1;
}
