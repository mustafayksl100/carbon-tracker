import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbHelpers } from '../../db/database';
import { seedDatabase } from '../../db/seed';
import { Card, Button } from '../../components/ui';
import { FiArrowLeft, FiArrowRight, FiCheck, FiHelpCircle } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import './Survey.css';

export default function Survey() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Initialize survey
    useEffect(() => {
        const initSurvey = async () => {
            try {
                // Seed database if needed
                await seedDatabase();

                // Load categories
                const cats = await dbHelpers.getCategories();
                setCategories(cats);

                // Create new session
                const newSessionId = uuidv4();
                setSessionId(newSessionId);

                // Load previous answers if any
                if (user) {
                    const prevAnswers = await dbHelpers.getAnswersBySession(user.id, newSessionId);
                    const answerMap = {};
                    prevAnswers.forEach(a => {
                        answerMap[a.questionId] = a.optionId;
                    });
                    setAnswers(answerMap);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error initializing survey:', error);
                setLoading(false);
            }
        };

        initSurvey();
    }, [user]);

    // Load questions when category changes
    useEffect(() => {
        const loadQuestions = async () => {
            if (categories.length > 0) {
                const categoryId = categories[currentCategoryIndex].id;
                const qs = await dbHelpers.getQuestionsByCategory(categoryId);
                setQuestions(qs);
                setCurrentQuestionIndex(0);
            }
        };

        loadQuestions();
    }, [categories, currentCategoryIndex]);

    // Load options when question changes
    useEffect(() => {
        const loadOptions = async () => {
            if (questions.length > 0) {
                const questionId = questions[currentQuestionIndex].id;
                const opts = await dbHelpers.getOptionsByQuestion(questionId);
                setOptions(opts);
            }
        };

        loadOptions();
    }, [questions, currentQuestionIndex]);

    const currentCategory = categories[currentCategoryIndex];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = categories.reduce((acc, cat, i) => {
        return acc + (i < currentCategoryIndex ? 5 : i === currentCategoryIndex ? currentQuestionIndex : 0);
    }, 0);
    const totalAllQuestions = 24;
    const progress = (Object.keys(answers).length / totalAllQuestions) * 100;

    const handleSelectOption = async (optionId) => {
        if (!user || !currentQuestion) return;

        const newAnswers = { ...answers, [currentQuestion.id]: optionId };
        setAnswers(newAnswers);

        // Save to database
        await dbHelpers.saveAnswer({
            userId: user.id,
            questionId: currentQuestion.id,
            optionId,
            sessionId
        });

        // Auto-advance after short delay (but not on the last question)
        const isLastQuestion = currentCategoryIndex === categories.length - 1 &&
            currentQuestionIndex === questions.length - 1;

        if (!isLastQuestion) {
            setTimeout(() => {
                handleNext();
            }, 300);
        }
    };

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (currentCategoryIndex < categories.length - 1) {
            setCurrentCategoryIndex(prev => prev + 1);
        }
    }, [currentQuestionIndex, questions.length, currentCategoryIndex, categories.length]);

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex(prev => prev - 1);
        }
    };

    const isLastQuestion = currentCategoryIndex === categories.length - 1 &&
        currentQuestionIndex === questions.length - 1;

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            // Calculate results
            let totalCarbon = 0;
            const categoryTotals = { energy: 0, transport: 0, food: 0, digital: 0, consumption: 0 };

            // Get all options for answered questions
            for (const [questionId, optionId] of Object.entries(answers)) {
                const opts = await dbHelpers.getOptionsByQuestion(parseInt(questionId));
                const selectedOption = opts.find(o => o.id === optionId);

                if (selectedOption) {
                    // Determine category (1=energy, 2=transport, 3=food, 4=digital, 5=consumption)
                    const qId = parseInt(questionId);
                    if (qId <= 5) categoryTotals.energy += selectedOption.carbonValue;
                    else if (qId <= 11) categoryTotals.transport += selectedOption.carbonValue;
                    else if (qId <= 15) categoryTotals.food += selectedOption.carbonValue;
                    else if (qId <= 19) categoryTotals.digital += selectedOption.carbonValue;
                    else categoryTotals.consumption += selectedOption.carbonValue;

                    totalCarbon += selectedOption.carbonValue;
                }
            }

            // Save result
            await dbHelpers.saveResult({
                userId: user.id,
                totalCarbonFootprint: totalCarbon,
                energyFootprint: categoryTotals.energy,
                transportFootprint: categoryTotals.transport,
                foodFootprint: categoryTotals.food,
                digitalFootprint: categoryTotals.digital,
                consumptionFootprint: categoryTotals.consumption,
                isOffset: false
            });

            navigate('/results');
        } catch (error) {
            console.error('Error submitting survey:', error);
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="survey-loading">
                <div className="spinner spinner-lg" />
                <p>Anket yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="survey">
            {/* Progress Bar */}
            <div className="survey-progress">
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="progress-text">
                    {Object.keys(answers).length} / {totalAllQuestions} soru
                </span>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                {categories.map((cat, index) => (
                    <button
                        key={cat.id}
                        className={`category-tab ${index === currentCategoryIndex ? 'active' : ''} ${index < currentCategoryIndex ? 'completed' : ''}`}
                        onClick={() => setCurrentCategoryIndex(index)}
                    >
                        <span className="tab-icon">{cat.icon}</span>
                        <span className="tab-name">{cat.name}</span>
                        {index < currentCategoryIndex && <FiCheck className="tab-check" />}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <Card variant="glass" padding="lg" className="question-card">
                {currentCategory && currentQuestion && (
                    <>
                        <div className="question-header">
                            <span className="question-category">{currentCategory.icon} {currentCategory.name}</span>
                            <button
                                className="help-btn"
                                onClick={() => setShowHelp(!showHelp)}
                                aria-label="Yardım"
                            >
                                <FiHelpCircle />
                            </button>
                        </div>

                        <h2 className="question-text">{currentQuestion.questionText}</h2>

                        {showHelp && currentQuestion.helpText && (
                            <div className="question-help">
                                {currentQuestion.helpText}
                            </div>
                        )}

                        <div className="options-grid">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    className={`option-card ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectOption(option.id)}
                                >
                                    <span className="option-key">{option.optionKey}</span>
                                    <div className="option-content">
                                        <span className="option-text">{option.optionText}</span>
                                        {option.description && (
                                            <span className="option-description">{option.description}</span>
                                        )}
                                    </div>
                                    {answers[currentQuestion.id] === option.id && (
                                        <FiCheck className="option-check" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </Card>

            {/* Navigation */}
            <div className="survey-nav">
                <Button
                    variant="ghost"
                    icon={<FiArrowLeft />}
                    onClick={handlePrevious}
                    disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
                >
                    Önceki
                </Button>

                <span className="question-counter">
                    Soru {currentQuestionIndex + 1} / {questions.length}
                </span>

                {isLastQuestion ? (
                    <Button
                        variant="primary"
                        icon={<FiCheck />}
                        iconPosition="right"
                        onClick={handleSubmit}
                        loading={submitting}
                        disabled={Object.keys(answers).length < totalAllQuestions}
                    >
                        Tamamla
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        icon={<FiArrowRight />}
                        iconPosition="right"
                        onClick={handleNext}
                    >
                        Sonraki
                    </Button>
                )}
            </div>
        </div>
    );
}
