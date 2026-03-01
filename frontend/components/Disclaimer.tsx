
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
      <AlertTriangle className="text-amber-600 flex-shrink-0 w-5 h-5 mt-0.5" />
      <div className="text-xs text-amber-800 leading-relaxed">
        <p className="font-bold mb-1">Tıbbi Uyarı:</p>
        Bu uygulama sadece bilgilendirme amaçlıdır. Yapay zeka tarafından yapılan analizler hata payı içerebilir. 
        Doğum süreci takibi ve tıbbi kararlar için mutlaka yetkili bir sağlık personeline danışılmalıdır. 
        Acil durumlarda derhal en yakın sağlık kuruluşuna başvurun.
      </div>
    </div>
  );
};

export default Disclaimer;
