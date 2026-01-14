// export const getLevel = (xp: number) => {
//     if (xp < 100) return { level: 'Beginner', color: 'bg-green-100 text-green-800', nextXP: 100 }
//     if (xp < 500) return { level: 'Intermediate', color: 'bg-blue-100 text-blue-800', nextXP: 500 }
//     if (xp < 1000) return { level: 'Advanced', color: 'bg-purple-100 text-purple-800', nextXP: 1000 }
//     if (xp < 2000) return { level: 'Expert', color: 'bg-red-100 text-red-800', nextXP: 2000 }
//     return { level: 'Master', color: 'bg-yellow-100 text-yellow-800', nextXP: xp + 500 }
// }

export const getAge = (birthDate: string) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    return age
}

export const getStreakStatus = (streakDays: number) => {
    if (streakDays === 0) return { text: 'Start your streak today!', color: 'bg-gray-100 text-gray-800' }
    if (streakDays < 7) return { text: `${streakDays} day streak`, color: 'bg-orange-100 text-orange-800' }
    if (streakDays < 30) return { text: `${streakDays} day streak`, color: 'bg-yellow-100 text-yellow-800' }
    return { text: `${streakDays} day streak 🔥`, color: 'bg-red-100 text-red-800' }
}

export function calculateStreak(lastActive: string, currentStreak: number) {
  const today = new Date();
  const last = new Date(lastActive);

  // تحويل التاريخ إلى YYYY-MM-DD
  const todayStr = today.toISOString().split('T')[0];
  const lastStr = last.toISOString().split('T')[0];

  if (todayStr === lastStr) {
    // المستخدم قام بالفعل بالنشاط اليوم → لا نزيد
    return currentStreak;
  }

  // الفرق بالأيام
  const diffTime = today.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // يوم متتالي → +1
    return currentStreak + 1;
  } else {
    // تخطى يوم أو أكثر → إعادة streak إلى 1
    return 1;
  }
}

export const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
