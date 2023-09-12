import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'; 
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-off-canvas-notes',
  templateUrl: './off-canvas-notes.component.html',
  styleUrls: ['./off-canvas-notes.component.css']
})
export class OffCanvasNotesComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;

  message: string = "Lorem ipsum @user1 dolor sit amet, @user2 consectetur adipiscing elit, @user3";
  users: string[] = ['user1', 'user2', 'user3']; // Daftar pengguna
  showSuggestions: boolean = false; // Status daftar saran
 
  highlightedText : string = "";
  constructor(
    public activeOffcanvas: NgbActiveOffcanvas
  ){}
  ngOnInit(): void {
    this.highlightedText = this.highlightUsernames(this.message);
  }

  close(){
    this.activeOffcanvas.dismiss();
  }

  sendMessage() {
    // Cek jika pesan mengandung '@' atau '#' dan tandai pengguna
    this.message = this.message.replace(/@(\w+)/g, '<span class="user-tag">@$1</span>');
    this.message = this.message.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');

  }

  addUserTag(user: string) {
    if (this.messageInput) {
      const tag = `${user} `;
    
      const cursorPosition = this.messageInput.nativeElement.selectionStart; 
      const messageStart = this.message.substring(0, cursorPosition); 
      const messageEnd = this.message.substring(cursorPosition); 
      this.message = messageStart +   tag + messageEnd;
      
      this.showSuggestions = false;
    }
 
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.showSuggestions = inputValue.includes('@') || inputValue.includes('#');
  }


  highlightUsernames(text : string) {
    // Regex untuk mencari kata-kata yang diawali dengan @
    const regex = /@(\w+)/g;
    
    // Ganti setiap kata yang cocok dengan format yang diinginkan
    const result = text.replace(regex, '<b>@$1</b>');
    
    return result;
  }
  
}


// Tentu, mari saya jelaskan regex /@(\w+)/g:

// /: Tanda garis miring pertama menandakan awal dari pola regex.
// @: Ini adalah karakter harfiah yang sesuai dengan karakter @ secara literal dalam teks.
// (: Tanda kurung buka menandakan awal dari apa yang disebut "grup tangkapan." Grup tangkapan memungkinkan Anda untuk mengekstrak bagian dari pencocokan yang cocok dengan pola dalam tanda kurung.
// \w: Ini adalah karakter set kelas karakter yang cocok dengan karakter huruf (baik huruf besar maupun huruf kecil) dan angka. \w setara dengan [a-zA-Z0-9].
// +: Tanda plus menunjukkan bahwa setidaknya satu atau lebih karakter yang cocok dengan \w harus ada.
// ): Tanda kurung tutup menandakan akhir dari grup tangkapan.
// /: Tanda garis miring kedua menandakan akhir dari pola regex.
// g: Ini adalah flag "global" yang menandakan bahwa pencarian akan dilakukan di seluruh teks, bukan hanya pencarian pertama yang ditemukan.