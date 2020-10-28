section .multiboot
.set magic, 0xe85250d6

multiboot_start:
    .long magic                ; multiboot 2
    .long 0                         ; protected mode i386
    .long multiboot_end - multiboot_start 
    ; checksum
    .long 0x100000000 - (magic + 0 + (multiboot_end - multiboot_start))
    
    ; insert extra metadata here?
    
    .long 0    
    .long 0    
    .long 8    
multiboot_end:

; todo bss

; todo text
