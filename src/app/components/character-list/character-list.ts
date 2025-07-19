import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';
import { finalize } from 'rxjs'; // Agrega esta importación

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  private api = inject(Api); // Inyección del servicio Api

  public characters = this.api.characters; // Conexión a la señal pública de personajes

  public searchTerm: string = '';      // Propiedad pública para el término de búsqueda
  public loading: boolean = false;     // Propiedad pública para el estado de carga
  public errorMessage: string = '';    // Propiedad pública para el mensaje de error

  public hasCharacters = computed(() => this.characters().length > 0); // Señal computada

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.getCharacters()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // Los personajes ya se actualizan por la señal en el servicio
        },
        error: () => {
          this.errorMessage = 'Error al cargar personajes';
        }
      });
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';
    this.api.searchCharacters(this.searchTerm)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // Los personajes ya se actualizan por la señal en el servicio
        },
        error: () => {
          this.errorMessage = 'No se encontraron personajes o hubo un error en la búsqueda';
        }
      });
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}