import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CusdisComments from "@/components/CusdisComments";
import Instructions from "@/components/Instructions";
import SubjectCard from "@/components/SubjectCard";
import ScoreInfo from "@/components/ScoreInfo";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GradeData } from "@/types/grades";

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
  const [additionalScoreDisplay, setAdditionalScoreDisplay] = useState<string>('0');
  const [totalScore, setTotalScore] = useState<number>(0);

  const handleGradeChange = (subjectIndex: number, field: string, value: string) => {
    const cleanedValue = value.replace(/^0+/, '');
    const numericValue = cleanedValue === '' ? 0 : parseFloat(cleanedValue);
    
    setGrades(prevGrades => {
      const newGrades = [...prevGrades];
      const subject = { ...newGrades[subjectIndex] };

      if (field === "aspd") {
        subject.aspdScore = numericValue;
      } else {
        const [classNum, semNum] = field.split("-");
        const classKey = `class${classNum}` as keyof typeof subject.grades;
        const semKey = `sem${semNum}` as keyof typeof subject.grades[typeof classKey];
        
        subject.grades = {
          ...subject.grades,
          [classKey]: {
            ...subject.grades[classKey],
            [semKey]: numericValue
          }
        };
      }

      newGrades[subjectIndex] = subject;
      return newGrades;
    });
  };

  const resetAllGrades = () => {
    setGrades(prevGrades => 
      prevGrades.map(subject => ({
        ...subject,
        grades: {
          class4: { sem1: 0, sem2: 0 },
          class5: { sem1: 0, sem2: 0 },
          class6: { sem1: 0 }
        },
        aspdScore: 0
      }))
    );
    setAdditionalScore(0);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Halo, saya ingin bertanya tentang PPDB SMP Negeri Sleman");
    window.open(`https://wa.me/628112500028?text=${message}`, '_blank');
  };

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
    
    const total = (averageSum * 0.3) + (aspdSum * 0.7) + additionalScore;
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

  const handleAdditionalScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAdditionalScoreDisplay(value);
    setAdditionalScore(value === '' ? 0 : parseFloat(value) || 0);
  };

return (
  <>
    <Navigation />


    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={tableRef}>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Kalkulator Simulasi Skor PSMB 2025 SMP Negeri Sleman
        </h1>
        
        <Instructions />

        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
          <Button
            onClick={resetAllGrades}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Semua Nilai
          </Button>
          <Button
            onClick={openWhatsApp}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Tanya via WhatsApp
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {grades.map((subject, index) => (
              <SubjectCard
                key={subject.subject}
                subject={subject}
                index={index}
                onGradeChange={handleGradeChange}
                calculateSubjectSum={calculateSubjectSum}
                calculateSubjectAverage={calculateSubjectAverage}
              />
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <label className="font-medium">Tambahan Nilai Prestasi (jika ada):</label>
              <input
                type="number"
                value={additionalScoreDisplay}
                onChange={handleAdditionalScoreChange}
                onMouseDown={() => setAdditionalScoreDisplay('')}
                onTouchStart={() => setAdditionalScoreDisplay('')}
                className="w-32 p-2 border rounded"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold">SKOR TOTAL PSMB:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalScore.toFixed(2)}
                </span>
              </div>
              
              <ScoreInfo totalScore={totalScore} />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={exportAsPDF}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Export sebagai PDF
                </Button>
                <Button
                  onClick={exportAsImage}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  Export sebagai Gambar
                </Button>
              </div>
            </div>
          </div>
        </div>

          <div className="mt-8">
            <CusdisComments />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
