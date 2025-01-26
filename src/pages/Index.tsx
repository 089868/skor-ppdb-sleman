import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface GradeData {
  subject: string;
  grades: {
    class4: { sem1: number; sem2: number };
    class5: { sem1: number; sem2: number };
    class6: { sem1: number };
  };
  aspdScore: number;
}

const Index = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [grades, setGrades] = useState<GradeData[]>([
    {
      subject: "Bahasa Indonesia",
      grades: {
        class4: { sem1: 91, sem2: 95 },
        class5: { sem1: 90, sem2: 91 },
        class6: { sem1: 86 },
      },
      aspdScore: 88,
    },
    {
      subject: "IPAS",
      grades: {
        class4: { sem1: 95, sem2: 99 },
        class5: { sem1: 93, sem2: 93 },
        class6: { sem1: 98 },
      },
      aspdScore: 76.67,
    },
    {
      subject: "Matematika",
      grades: {
        class4: { sem1: 95, sem2: 91 },
        class5: { sem1: 91, sem2: 88 },
        class6: { sem1: 96 },
      },
      aspdScore: 88.57,
    },
  ]);

  const [additionalScore, setAdditionalScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

  const calculateSubjectSum = (gradeData: GradeData) => {
    const values = [
      gradeData.grades.class4.sem1,
      gradeData.grades.class4.sem2,
      gradeData.grades.class5.sem1,
      gradeData.grades.class5.sem2,
      gradeData.grades.class6.sem1,
    ];
    return values.reduce((acc, curr) => acc + curr, 0);
  };

  const calculateSubjectAverage = (gradeData: GradeData) => {
    const sum = calculateSubjectSum(gradeData);
    return (sum / 5).toFixed(1);
  };

  const calculateTotal = () => {
    const averageSum = grades.reduce(
      (acc, curr) => acc + parseFloat(calculateSubjectAverage(curr)),
      0
    );
    const aspdSum = grades.reduce((acc, curr) => acc + curr.aspdScore, 0);
    
    const total = (averageSum * 0.4) + (aspdSum * 0.6) + additionalScore;
    setTotalScore(parseFloat(total.toFixed(2)));
  };

  useEffect(() => {
    calculateTotal();
  }, [grades, additionalScore]);

  const exportAsPDF = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ppdb-skor-calculation.pdf');
      });
    }
  };

  const exportAsImage = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'ppdb-skor-calculation.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={tableRef}>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Kalkulator Simulasi Skor PPDB SMP Negeri Sleman
        </h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Petunjuk Penggunaan:</h2>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Isikan nilai rapor untuk setiap mata pelajaran di setiap semester</li>
            <li>Masukkan nilai ASPD untuk setiap mata pelajaran</li>
            <li>Jika ada, tambahkan nilai prestasi pada kolom yang tersedia</li>
            <li>Skor total akan dihitung secara otomatis</li>
          </ol>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="bg-blue-800 text-white px-4 py-3">Mata Pelajaran</th>
                <th className="bg-yellow-500 text-white px-4 py-2" colSpan={2}>Nilai Kelas 4</th>
                <th className="bg-cyan-500 text-white px-4 py-2" colSpan={2}>Nilai Kelas 5</th>
                <th className="bg-blue-600 text-white px-4 py-2">Nilai Kelas 6</th>
                <th className="bg-gray-700 text-white px-4 py-2">Nilai ASPD</th>
                <th className="bg-blue-900 text-white px-4 py-2">Jumlah Nilai Rapor</th>
                <th className="bg-blue-900 text-white px-4 py-2">Rata-Rata Nilai Rapor</th>
              </tr>
              <tr>
                <th className="px-4 py-2"></th>
                <th className="bg-yellow-400 text-white px-4 py-2">SMT 1</th>
                <th className="bg-yellow-400 text-white px-4 py-2">SMT 2</th>
                <th className="bg-cyan-400 text-white px-4 py-2">SMT 1</th>
                <th className="bg-cyan-400 text-white px-4 py-2">SMT 2</th>
                <th className="bg-blue-500 text-white px-4 py-2">SMT 1</th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {grades.map((subject, index) => (
                <tr key={subject.subject}>
                  <td className="px-4 py-2 font-medium">{subject.subject}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.grades.class4.sem1}
                      onChange={(e) => handleGradeChange(index, "4-1", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.grades.class4.sem2}
                      onChange={(e) => handleGradeChange(index, "4-2", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.grades.class5.sem1}
                      onChange={(e) => handleGradeChange(index, "5-1", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.grades.class5.sem2}
                      onChange={(e) => handleGradeChange(index, "5-2", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.grades.class6.sem1}
                      onChange={(e) => handleGradeChange(index, "6-1", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.aspdScore}
                      onChange={(e) => handleGradeChange(index, "aspd", e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {calculateSubjectSum(subject)}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {calculateSubjectAverage(subject)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} className="px-4 py-2 text-right font-bold">
                  Total:
                </td>
                <td className="px-4 py-2 font-bold">
                  {grades.reduce((acc, curr) => acc + curr.aspdScore, 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 font-bold">
                  {grades
                    .reduce((acc, curr) => acc + parseFloat(calculateSubjectSum(curr).toString()), 0)
                    .toFixed(2)}
                </td>
                <td className="px-4 py-2 font-bold">
                  {grades
                    .reduce(
                      (acc, curr) => acc + parseFloat(calculateSubjectAverage(curr)),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-medium">
                Tambahan Nilai Prestasi (jika ada):
              </label>
              <input
                type="number"
                value={additionalScore}
                onChange={(e) => setAdditionalScore(parseFloat(e.target.value) || 0)}
                className="w-32 p-2 border rounded"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold">SKOR TOTAL PPDB:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalScore.toFixed(2)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">* SKOR TOTAL PPDB Sleman adalah gabungan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>(Total Nilai ASPD × 60%)</li>
                  <li>(Total Rata-Rata Rapor × 40%)</li>
                  <li>Nilai Prestasi (Jika Ada)</li>
                </ul>
                <p className="mt-2">
                  Berdasarkan rumus dalam{" "}
                  <a 
                    href="https://disdik.slemankab.go.id/wp-content/uploads/2023/05/JUKNIS-PPDB-SMP-TAHUN-PELAJARAN-2023-2024.pdf"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Juknis PPDB SMP
                  </a>
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={exportAsPDF}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Export sebagai PDF
                </button>
                <button
                  onClick={exportAsImage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Export sebagai Gambar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
