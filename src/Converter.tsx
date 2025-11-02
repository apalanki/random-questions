import React, { useState } from "react";
import { Download, Upload } from "lucide-react";

interface Transaction {
  tranNo: string;
  tranDate: string;
  dept: string;
  bookCode: string;
  voucherNo: string;
  chqNo: string;
  voucherDate: string;
  debit: string;
  credit: string;
  name: string;
  srAgPolNo: string;
  description: string;
  bankDetails: string;
}

const TransactionExcelConverter: React.FC = () => {
  const [status, setStatus] = useState<string>("Please upload a file");
  const [recordCount, setRecordCount] = useState<number>(0);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    console.log("Uploaded file:", file);
    if (!file) {
      console.log("file upload error");
      return;
    }

    setFileName(file.name);
    setStatus("Reading file...");

    try {
      const text = await file.text();
      setFileContent(text);

      const transactions = parseTransactions(text);
      setRecordCount(transactions.length);
      setStatus("File loaded - Ready to download");
    } catch (error) {
      setStatus("Error reading file");
      console.error("Error:", error);
    }
  };

  // Parse the transaction data from file content
  // Parse the transaction data from file content
  const parseTransactions = (content: string): Transaction[] => {
    const transactions: Transaction[] = [];

    // Split by lines and look for transaction data patterns
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for lines that contain the main transaction pattern (simplified regex)
      // Pattern: |number|date|dept|bookcode|number|number|date|amount|amount|
      const match = line.match(
        /\|\s*(\d+)\|\s*(\d{2}\/\d{2}\/\d{4})\s*\|\s*(\w+)\s*\|\s*(\w+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d{2}\/\d{2}\/\d{4})\s*\|\s*([\d,]+\.?\d*)\s*\|\s*([\d,]+\.?\d*)\s*\|/,
      );

      if (match) {
        // Look for name in the next line
        let name = "";
        let srAgPolNo = "";
        let description = "";
        let bankDetails = "";

        // Check next few lines for additional data
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          const currentLine = lines[j];

          // Extract name and policy number
          if (!name) {
            const nameMatch = currentLine.match(
              /Name\s*:\s*([^|]+?)\s+Sr\/Ag\/Pol No\s*:\s*([^|]+?)\s*\|/,
            );
            if (nameMatch) {
              name = nameMatch[1].trim();
              srAgPolNo = nameMatch[2].trim();
            }
          }

          // Extract description (text between pipes that's not the name line)
          if (
            !description &&
            name &&
            currentLine.includes("|") &&
            !currentLine.includes("Name :")
          ) {
            const descMatch = currentLine.match(/\|([A-Z][^|]{10,}?)\s*\|/);
            if (descMatch) {
              description = descMatch[1].trim();
            }
          }

          // Extract bank details
          if (!bankDetails) {
            const bankMatch = currentLine.match(
              /for\s+(NEFT-[\w-]+)\s+([\w\s.-]+)/,
            );
            if (bankMatch) {
              bankDetails = `${bankMatch[1]} ${bankMatch[2].trim()}`;
            }
          }
        }

        if (name) {
          transactions.push({
            tranNo: match[1],
            tranDate: match[2],
            dept: match[3],
            bookCode: match[4],
            voucherNo: match[5],
            chqNo: match[6],
            voucherDate: match[7],
            debit: match[8].replace(/,/g, ""),
            credit: match[9].replace(/,/g, ""),
            name: name,
            srAgPolNo: srAgPolNo,
            description: description,
            bankDetails: bankDetails,
          });
        }
      }
    }

    return transactions;
  };
  const downloadExcel = (): void => {
    if (!fileContent) {
      setStatus("Please upload a file first");
      return;
    }

    const transactions = parseTransactions(fileContent);

    // Create CSV content
    const headers = [
      "Tran No",
      "Tran Date",
      "Dept",
      "Book Code",
      "Voucher No",
      "Chq No",
      "Voucher Date",
      "Debit",
      "Credit",
      "Name",
      "Sr/Ag/Pol No",
      "Description",
      "Bank Details",
    ];

    let csvContent = headers.join(",") + "\n";

    transactions.forEach((t: Transaction) => {
      const row = [
        t.tranNo,
        t.tranDate,
        t.dept,
        t.bookCode,
        t.voucherNo,
        t.chqNo,
        t.voucherDate,
        t.debit,
        t.credit,
        `"${t.name}"`,
        t.srAgPolNo,
        `"${t.description}"`,
        `"${t.bankDetails}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "transactions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatus("Download complete!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Transaction Data Converter
            </h1>
            <p className="text-gray-600">
              Upload your RTF file and convert to Excel format
            </p>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50">
                <Upload className="mx-auto mb-4 text-blue-500" size={48} />
                <p className="text-gray-700 font-semibold mb-2">
                  Click to upload file
                </p>
                <p className="text-sm text-gray-500">
                  {fileName || "RTF or text file"}
                </p>
                <input
                  type="file"
                  accept=".rtf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recordCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-800">{status}</p>
              </div>
            </div>
          </div>

          <button
            onClick={downloadExcel}
            disabled={!fileContent}
            className={`w-full font-semibold py-4 px-6 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2 ${
              fileContent
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Download size={24} />
            Download as CSV (Excel Compatible)
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>How to use:</strong>
            </p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Upload your RTF or text file</li>
              <li>Wait for the file to be processed</li>
              <li>Click download to get your CSV file</li>
              <li>Open the CSV file in Excel</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionExcelConverter;
