interface XPProgressProps {
  profile: {
    total_xp: number;
  };
  t: (key: string, params?: Record<string, any>) => string;
  userLevel: string;
  nextXP: number | null;
  progressPercentage: number;
}

const XPProgress: React.FC<XPProgressProps> = ({
  profile,
  t,
  userLevel,
  nextXP,
  progressPercentage
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">{t('progress.title')}</h3>
        <span className="text-2xl font-bold text-indigo-600">
          {profile.total_xp || 0} {t('xp')}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{t('progress.toLevel', { level: userLevel })}</span>
            <span>
              {profile.total_xp || 0} / {nextXP} {t('xp')}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPProgress;