export interface ModuleIndex {
  id: string;
  title: string;
  icon: string;
  file: string;
  submodules: SubmoduleIndex[];
}

export interface SubmoduleIndex {
  id: string;
  title: string;
}

export interface ModuleContent {
  id: string;
  title: string;
  icon: string;
  submodules: SubmoduleContent[];
}

export interface SubmoduleContent {
  id: string;
  title: string;
  jumbotronImage: string;
  content: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}
