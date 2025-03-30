import type { ResumeSchema } from '../types/json-resume';

// Import themes (these are the actual npm packages)
import elegant from 'jsonresume-theme-elegant';
import paper from 'jsonresume-theme-paper';
import stackoverflow from 'jsonresume-theme-stackoverflow';
import classy from 'jsonresume-theme-classy';
import macchiato from 'jsonresume-theme-macchiato';
import kendall from 'jsonresume-theme-kendall';
import americano from 'jsonresume-theme-americano';
import actual from 'jsonresume-theme-actual';
import * as reactive from 'jsonresume-theme-reactive';
import engineering from 'jsonresume-theme-engineering';
import caffeine from 'jsonresume-theme-caffeine';
import businessProfessionalCompact from 'jsonresume-theme-business-professional-compact';
import papirus from 'jsonresume-theme-papirus';

//https://gist.github.com/asbjornu/7873be2713fcacc911be2035a482091d
// Theme registry
const themes: Record<string, (resume: ResumeSchema) => string> = {
  elegant: elegant.render,
  paper: paper.render,
  stackoverflow: stackoverflow.render,
  classy: classy.render,
  macchiato: macchiato.render,
  kendall: kendall.render,
  americano: americano.render,
  actual: actual.render,
  reactive: reactive.render,
  engineering: engineering.render,
  caffeine: caffeine.render,
  'business-professional-compact': businessProfessionalCompact.render,
  papirus: papirus.render,
};

export function renderWithTheme(themeName: string, resume: ResumeSchema): string {
  const theme = themes[themeName];
  if (!theme) {
    throw new Error(`Theme '${themeName}' not found. Available themes: ${Object.keys(themes).join(', ')}`);
  }
  return theme(resume);
}

export const availableThemes = Object.keys(themes); 