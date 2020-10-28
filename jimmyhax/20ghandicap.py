
import ctypes
from mem_edit import process
lv15 = p.ulong(140320106)
where  = input("ppt exec is at: ")
gam = Process.get_pid_by_name(where)
with Process.open_process(gam):
  xd = p.search_all_memory(lv15)
  if len(xd) == 1:
    print("oops theres more than one")
    elif:
      p.write_memoryr(xd[0], ctypes.numlong(-1))

