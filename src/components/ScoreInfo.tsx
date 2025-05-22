interface ScoreInfoProps {
  totalScore: number;
}

const ScoreInfo = ({ totalScore }: ScoreInfoProps) => {
  return (
    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
      <p className="font-semibold mb-2">* SKOR TOTAL SPMB 2025 Sleman adalah gabungan:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>(Total Nilai ASPD × 70%)</li>
        <li>(Total Rata-Rata Rapor × 30%)</li>
        <li>Nilai Prestasi (Jika Ada, di jalur prestasi)</li>
      </ul>
      <p className="mt-2">
        Berdasarkan SOSIALISASI SPMB 2025 SMP NEGERI SLEMAN di {" "}
        <a 
          href="https://www.youtube.com/watch?v=zyfb8kXlzZ8"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Juknis SPMB 2025 SMP belum terbit
        </a>
      </p>
    </div>
  );
};

export default ScoreInfo;
