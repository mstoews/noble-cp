import { Component, OnInit, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { IEvidence } from 'app/services/evidence.service'
import { MaterialModule } from 'app/services/material.module'

const imports = [MaterialModule]
  
@Component({
  standalone: true,
  selector: 'evidence-card',
  imports:[imports],
  templateUrl: './evidence-card.component.html',
})
export class EvidenceCardComponent implements OnInit {

  @Input() evidence: IEvidence
  loggedIn: boolean = false;
  productId: string;
  sub: Subscription;
  isLoggedIn$: Observable<boolean>;

  private router = inject(Router);  
  private snackBar = inject(MatSnackBar);
    
  ngOnInit(): void {

  }

  openEvidenceDetail() {
    this.router.navigate(['artifacts/evidence', this.evidence.reference]);
  }
}
