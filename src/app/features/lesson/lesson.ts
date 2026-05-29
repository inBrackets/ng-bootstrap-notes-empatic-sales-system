import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, EMPTY } from 'rxjs';
import { ContentService } from '../../shared/services/content.service';
import { ModuleContent, SubmoduleContent } from '../../shared/models/content.model';

@Component({
  selector: 'app-lesson',
  imports: [],
  templateUrl: './lesson.html',
  styleUrl: './lesson.sass'
})
export class LessonComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly contentService = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly moduleData = signal<ModuleContent | null>(null);
  readonly submoduleData = signal<SubmoduleContent | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly selectedAnswers = signal<Record<string, string>>({});
  readonly submitted = signal(false);

  readonly score = computed(() => {
    const sub = this.submoduleData();
    if (!sub) return { correct: 0, total: 0 };
    const answers = this.selectedAnswers();
    const correct = sub.questions.filter(q =>
      q.answers.find(a => a.id === answers[q.id])?.isCorrect ?? false
    ).length;
    return { correct, total: sub.questions.length };
  });

  readonly quizStatusClass = computed(() => {
    const { correct, total } = this.score();
    if (total === 0) return 'secondary';
    const pct = correct / total;
    if (pct === 1) return 'success';
    if (pct >= 0.5) return 'warning';
    return 'danger';
  });

  readonly safeContent = computed((): SafeHtml => {
    const sub = this.submoduleData();
    return this.sanitizer.bypassSecurityTrustHtml(sub?.content ?? '');
  });

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(params => {
        this.loading.set(true);
        this.error.set(null);
        this.selectedAnswers.set({});
        this.submitted.set(false);
        return this.contentService.getModule(params['moduleId']).pipe(
          map(module => ({ module, submoduleId: params['submoduleId'] as string })),
          catchError(() => {
            this.error.set('Failed to load lesson content. Please try again.');
            this.loading.set(false);
            return EMPTY;
          })
        );
      })
    ).subscribe(({ module, submoduleId }) => {
      const sub = module.submodules.find(s => s.id === submoduleId);
      if (sub) {
        this.moduleData.set(module);
        this.submoduleData.set(sub);
      } else {
        this.error.set('Lesson not found.');
      }
      this.loading.set(false);
    });
  }

  selectAnswer(questionId: string, answerId: string): void {
    if (!this.submitted()) {
      this.selectedAnswers.update(prev => ({ ...prev, [questionId]: answerId }));
    }
  }

  submitQuiz(): void {
    this.submitted.set(true);
  }

  resetQuiz(): void {
    this.submitted.set(false);
    this.selectedAnswers.set({});
  }
}
