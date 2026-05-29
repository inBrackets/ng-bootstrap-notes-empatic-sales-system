import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { ModuleContent, ModuleIndex } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  private readonly index$ = this.http
    .get<ModuleIndex[]>('assets/data/modules-index.json')
    .pipe(shareReplay(1));

  private readonly modules$ = new Map<string, Observable<ModuleContent>>();

  getModulesIndex(): Observable<ModuleIndex[]> {
    return this.index$;
  }

  getModule(moduleId: string): Observable<ModuleContent> {
    if (!this.modules$.has(moduleId)) {
      const module$ = this.index$.pipe(
        switchMap(index => {
          const entry = index.find(m => m.id === moduleId);
          if (!entry) {
            return throwError(() => new Error(`Module "${moduleId}" not found`));
          }
          return this.http.get<ModuleContent>(entry.file);
        }),
        shareReplay(1)
      );
      this.modules$.set(moduleId, module$);
    }
    return this.modules$.get(moduleId)!;
  }
}
