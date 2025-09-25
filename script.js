class GuardianGame {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 1;
        this.questionsPerLevel = 5;
        this.maxLevel = 20;
        this.currentAnswer = '';
        this.isRomanToDecimal = true;
        
        this.levels = [
            "El fill del traïdor",
            "El secret del rei", 
            "El misteri de la tundra",
            "Traïció al nord",
            "El refugi secret",
            "El sender de l'especialista",
            "El rei de l'oest",
            "La reina turquesa",
            "Conjur de poder",
            "El gran consell",
            "Orígens glacials",
            "Esperit de drac",
            "Crida arcana",
            "Missió a l'est",
            "El despertar de l'immortal",
            "La reina druida",
            "El secret del drac",
            "El tron del nord",
            "Amenaça insondable",
            "El sacrifici del rei"
        ];

        this.completionMessages = [
            "Has descobert la veritat sobre el fill del traïdor. El camí del guardabosc comença!",
            "Has desxifrat el secret del rei i guanyes la seua confiança.",
            "Els vents gelats revelen el misteri amagat a la tundra.",
            "Has descobert la traïció i protegit les terres del nord.",
            "El refugi ha sigut trobat i els teus companys estan segurs.",
            "Has perfeccionat les teues habilitats i ja eres un especialista.",
            "La corona de l'oest reconeix la teua valentia.",
            "La reina turquesa et beneïx amb saviesa i protecció.",
            "Has controlat l'antic conjur i evitat el desastre.",
            "El gran consell et reconeix com a digne guardabosc.",
            "Els orígens gelats et revelen la força de la natura.",
            "L'esperit del drac s'uneix a tu en la teua missió.",
            "Has respost a la crida arcana i superat la prova màgica.",
            "La missió a l'est ha sigut un èxit gràcies a la teua astúcia.",
            "Has sigut testimoni del despertar i l'has sabut afrontar.",
            "La reina druida et regala la força dels boscos.",
            "El secret del drac ha sigut revelat només a tu.",
            "Has aconseguit defensar el tron del nord amb honor.",
            "L'amenaça insondable ha sigut vençuda gràcies al teu coratge.",
            "Has completat el sacrifici final i el sender del guardabosc arriba al seu destí."
        ];

        this.successPhrases = [
            "Excellent, Lasgol! El guardabosc avança!",
            "Perfecte, Lasgol! La saviesa creix!",
            "Molt bé, Lasgol! Els antics nombres et revelen els seus secrets!",
            "Fantàstic, Lasgol! El poder dels números romans flueix per tu!",
            "Increïble, Lasgol! Domines l'art dels guardaboscs!"
        ];

        this.initializeGame();
    }

    romanToDecimal(roman) {
        const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let result = 0;
        let prev = 0;
        
        for (let i = roman.length - 1; i >= 0; i--) {
            const current = values[roman[i]];
            if (current < prev) {
                result -= current;
            } else {
                result += current;
            }
            prev = current;
        }
        return result;
    }

    decimalToRoman(num) {
        const values = [
            [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
            [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
            [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
        ];
        
        let result = '';
        for (const [value, symbol] of values) {
            while (num >= value) {
                result += symbol;
                num -= value;
            }
        }
        return result;
    }

    getNumberRange(level) {
        if (level <= 5) return { min: 1, max: 100 };
        if (level <= 10) return { min: 1, max: 500 };
        if (level <= 15) return { min: 1, max: 1000 };
        return { min: 1, max: 3999 };
    }

    generateQuestion() {
        const range = this.getNumberRange(this.currentLevel);
        const number = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        this.isRomanToDecimal = Math.random() < 0.5;
        
        if (this.isRomanToDecimal) {
            const romanNum = this.decimalToRoman(number);
            document.getElementById('number-display').textContent = romanNum;
            document.getElementById('question-text').textContent = 'Converteix aquest nombre romà a decimal:';
            this.currentAnswer = number.toString();
        } else {
            document.getElementById('number-display').textContent = number;
            document.getElementById('question-text').textContent = 'Converteix aquest nombre decimal a romà:';
            this.currentAnswer = this.decimalToRoman(number);
        }
        
        document.getElementById('answer-input').value = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('feedback').textContent = '';
    }

    checkAnswer() {
        const userAnswer = document.getElementById('answer-input').value.trim().toUpperCase();
        const feedback = document.getElementById('feedback');
        
        if (userAnswer === this.currentAnswer.toUpperCase()) {
            feedback.className = 'feedback success';
            const phrase = this.successPhrases[Math.floor(Math.random() * this.successPhrases.length)];
            feedback.textContent = phrase;
            
            setTimeout(() => {
                this.currentQuestion++;
                if (this.currentQuestion > this.questionsPerLevel) {
                    this.completeLevel();
                } else {
                    this.updateProgress();
                    this.generateQuestion();
                }
            }, 1500);
        } else {
            feedback.className = 'feedback error';
            const hint = this.isRomanToDecimal ? 
                `Pista per a Lasgol: Recorda les regles bàsiques. ¿Has sumat i restat correctament?` :
                `Pista per a Lasgol: Utilitza els símbols I, V, X, L, C, D, M. Recorda les regles de substracció.`;
            feedback.textContent = `Incorrect. ${hint}`;
        }
    }

    completeLevel() {
        const modal = document.getElementById('completion-modal');
        const message = document.getElementById('completion-message');
        message.textContent = this.completionMessages[this.currentLevel - 1];
        modal.classList.remove('hidden');
    }

    nextLevel() {
        this.currentLevel++;
        this.currentQuestion = 1;
        
        if (this.currentLevel > this.maxLevel) {
            this.showFinalScreen();
            return;
        }
        
        this.updateLevel();
        this.updateProgress();
        this.generateQuestion();
        document.getElementById('completion-modal').classList.add('hidden');
    }

    showFinalScreen() {
        document.getElementById('final-modal').classList.remove('hidden');
    }

    updateLevel() {
        document.getElementById('level-title').textContent = this.levels[this.currentLevel - 1];
        document.getElementById('level-counter').textContent = `Nivell ${this.currentLevel} de ${this.maxLevel}`;
    }

    updateProgress() {
        document.getElementById('question-counter').textContent = `Pregunta ${this.currentQuestion} de ${this.questionsPerLevel}`;
    }

    initializeGame() {
        this.updateLevel();
        this.updateProgress();
        this.generateQuestion();
        
        document.getElementById('submit-btn').addEventListener('click', () => this.checkAnswer());
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
        
        document.getElementById('help-btn').addEventListener('click', () => {
            document.getElementById('help-modal').classList.remove('hidden');
        });
        
        document.getElementById('close-help').addEventListener('click', () => {
            document.getElementById('help-modal').classList.add('hidden');
        });
        
        document.getElementById('continue-btn').addEventListener('click', () => this.nextLevel());
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.currentLevel = 1;
            this.currentQuestion = 1;
            document.getElementById('final-modal').classList.add('hidden');
            this.initializeGame();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GuardianGame();
});