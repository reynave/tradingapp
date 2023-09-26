import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core'; 
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-upload-data',
  templateUrl: './modal-upload-data.component.html',
  styleUrls: ['./modal-upload-data.component.css']
})
export class ModalUploadDataComponent {
  @Input() journalId: any;
  selectedFile: File | null = null;
  constructor(
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    private configService : ConfigService,
  ) { }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Pilih file CSV terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', this.selectedFile);
    formData.append('journalId', this.journalId);
    formData.append('accountId', this.configService.account()['account']['id']);
    
    formData.append('template', 'template'); 

    this.http.post(environment.api+'upload/uploadCsv', formData).subscribe(
      (response) => {
        console.log('File berhasil diunggah:', response);
        // Tambahkan logika lain di sini jika diperlukan
      },
      (error) => {
        console.error('Terjadi kesalahan:', error);
      }
    );
  }
  close(){
    this.activeModal.dismiss();
  }
}
