import Dexie from 'dexie';

// Create database instance
export const db = new Dexie('CarbonTrackerDB');

// Define database schema
db.version(1).stores({
  // Users table - authentication and basic info
  users: '++id, email, username, createdAt',
  
  // User profiles - extended profile info
  userProfiles: '++id, userId, fullName, country, city',
  
  // Question categories - energy, transport, food, digital, consumption
  questionCategories: '++id, name, orderIndex',
  
  // Questions - survey questions
  questions: '++id, categoryId, questionText, questionType, isActive',
  
  // Question options - choices for each question
  questionOptions: '++id, questionId, optionKey, carbonValue, orderIndex',
  
  // User answers - stores user responses
  userAnswers: '++id, userId, questionId, optionId, sessionId, answeredAt',
  
  // Carbon results - calculation results
  carbonResults: '++id, userId, calculationDate, totalCarbonFootprint, isOffset',
  
  // Carbon offsets - donation/offset records
  carbonOffsets: '++id, userId, resultId, offsetAmount, projectType, offsetDate',
  
  // Donation history
  donationHistory: '++id, userId, amount, projectType, donationDate, paymentStatus',
  
  // Sessions - for tracking survey progress
  sessions: '++id, odudatedAtserId, startedAt, completedAt, currentCategoryIndex, isComplete'
});

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const id = await db.users.add({
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return id;
  },

  async getUserByEmail(email) {
    return await db.users.where('email').equals(email).first();
  },

  async getUserById(id) {
    return await db.users.get(id);
  },

  async updateUser(id, updates) {
    return await db.users.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Profile operations
  async createProfile(profileData) {
    return await db.userProfiles.add(profileData);
  },

  async getProfileByUserId(userId) {
    return await db.userProfiles.where('userId').equals(userId).first();
  },

  async updateProfile(userId, updates) {
    const profile = await db.userProfiles.where('userId').equals(userId).first();
    if (profile) {
      return await db.userProfiles.update(profile.id, updates);
    }
    return await db.userProfiles.add({ userId, ...updates });
  },

  // Question operations
  async getCategories() {
    return await db.questionCategories.orderBy('orderIndex').toArray();
  },

  async getQuestionsByCategory(categoryId) {
    return await db.questions
      .where('categoryId')
      .equals(categoryId)
      .and(q => q.isActive)
      .toArray();
  },

  async getOptionsByQuestion(questionId) {
    return await db.questionOptions
      .where('questionId')
      .equals(questionId)
      .sortBy('orderIndex');
  },

  // Answer operations
  async saveAnswer(answerData) {
    const existing = await db.userAnswers
      .where(['userId', 'questionId', 'sessionId'])
      .equals([answerData.userId, answerData.questionId, answerData.sessionId])
      .first();
    
    if (existing) {
      return await db.userAnswers.update(existing.id, {
        ...answerData,
        answeredAt: new Date().toISOString()
      });
    }
    
    return await db.userAnswers.add({
      ...answerData,
      answeredAt: new Date().toISOString()
    });
  },

  async getAnswersBySession(userId, sessionId) {
    return await db.userAnswers
      .where('sessionId')
      .equals(sessionId)
      .and(a => a.userId === userId)
      .toArray();
  },

  // Results operations
  async saveResult(resultData) {
    return await db.carbonResults.add({
      ...resultData,
      calculationDate: new Date().toISOString()
    });
  },

  async getResultsByUser(userId) {
    return await db.carbonResults
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('calculationDate');
  },

  async getLatestResult(userId) {
    const results = await db.carbonResults
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('calculationDate');
    return results[0];
  },

  // Offset operations
  async saveOffset(offsetData) {
    return await db.carbonOffsets.add({
      ...offsetData,
      offsetDate: new Date().toISOString()
    });
  },

  async getOffsetsByUser(userId) {
    return await db.carbonOffsets
      .where('userId')
      .equals(userId)
      .toArray();
  },

  // Session operations
  async createSession(userId) {
    return await db.sessions.add({
      odudatedAtserId: null,
      userId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      currentCategoryIndex: 0,
      isComplete: false
    });
  },

  async updateSession(sessionId, updates) {
    return await db.sessions.update(sessionId, {
      ...updates,
      odudatedAtserId: new Date().toISOString()
    });
  },

  async getActiveSession(userId) {
    return await db.sessions
      .where('userId')
      .equals(userId)
      .and(s => !s.isComplete)
      .first();
  }
};

export default db;
