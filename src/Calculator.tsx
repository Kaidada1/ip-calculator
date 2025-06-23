import React from "react";
import "./Calculator.css";
import { Checkbox } from 'antd';

function App() {
    const [current, setCurrent] = React.useState<string>("0");
    const [previous, setPrevious] = React.useState<string>("");
    const [operator, setOperator] = React.useState<string|null>(null);
    const [overWrite, setOverWrite] = React.useState<boolean>(false);
    const [history, setHistory] = React.useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = React.useState<boolean>(false);
    const [showCheckboxes, setShowCheckboxes] = React.useState<boolean>(false);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

    type HistoryItem = {
        expression: string;
        result: string;
    }

    const clear = () => {
        setCurrent("0");
        setPrevious("");
        setOperator(null);
        setOverWrite(false);    
    };

    const changeSign = () => {
        setCurrent((prev)=>
            prev.charAt(0) === "-" ? prev.slice(1) : "-" + prev
        )
    }

    const chooseOperator = (op:string) => {
        if(current === "" ) return;
        if(previous !== "" && !overWrite) {
            calculate();
            setPrevious(current); 
        } else {
            setPrevious(current);
        }
        setOperator(op);
        setOverWrite(true)
    }

    const chooseNumber = (number:string) => {
        if(overWrite) {
            setCurrent(number);
            setOverWrite(false);
        } else {
            if (number === "." && current.includes(".")) return;
            setCurrent(current ==="0" && number !== "." ? number : current + number);
        }
    }

    const handleCheckboxChange = (index: number, checked: boolean) => {
        setSelectedItems(prev => {
            if (checked) {
                return [...prev, index];
            } else {
                return prev.filter(i => i !== index);
            }
        });
    };

    const deleteHandle = ()=> {
        if(current !== "0"){
            setCurrent(current.slice(0, -1));
        }if(current ===""){
            setCurrent("0");
        };
    }

    const calculate = () => {
        if (operator === "null" || previous === "null" ) return;
        const a = parseFloat(previous);
        const b = parseFloat(current);
        let result = 0;
        switch (operator) {
            case "+":
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "x":
                result = a * b;
                break;
            case "/":
                result = a / b;
                break;
            case "%":
                result = a / 100;
                break;
            default:
                break;
        }
        setCurrent(result.toString());
        setPrevious(`${previous} ${operator} ${current}`);
        setOperator(null);
        setOverWrite(true);
        setHistory((prev) => [
            ...prev,
            {
                expression:`${previous} ${operator} ${current}`,
                result: result.toString(),
            }
        ]
        );
    }

    const buttons: [React.ReactNode, string, () => void] [] =[
        ["<=", "function", deleteHandle],
        ["AC", "function", clear],
        ["±", "function", changeSign],
        ["%", "function", () => chooseOperator("%")],
        [/*<FaDivide/>*/"/", "operator", () => chooseOperator("/")],

        ["7", "number", () => chooseNumber("7") ],
        ["8", "number", () => chooseNumber("8")],
        ["9", "number", () => chooseNumber("9")],
        ["x", "operator", () => chooseOperator("x")],

        ["4", "number", () => chooseNumber("4")],
        ["5", "number", () => chooseNumber("5")],
        ["6", "number", () => chooseNumber("6")],
        ["-", "operator", () => chooseOperator("-")],
        
        ["1", "number", () => chooseNumber("1")],
        ["2", "number", () => chooseNumber("2")],
        ["3", "number", () => chooseNumber("3")],
        ["+", "operator", () => chooseOperator("+")],

        [/*<TiCalculator size={50} />*/"?", "number", () => console.log("Calculator icon clicked")],
        ["0", "number", () => chooseNumber("0")],
        [".", "number", () => chooseNumber(".")],
        ["=", "operator", calculate]
    ]

    React.useEffect(() => {
        const savedHistory = localStorage.getItem("history");
        setHistory(savedHistory ? JSON.parse(savedHistory) : []);
    }, []);

    React.useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    return (
        <div className="calculator">
            <div className="list" onClick={() => setShowHistory(true)}>!</div>
            <div className="display">
                <div className="previous">{operator ? `${previous} ${operator}`:previous}</div>
                <div className="current">{current}</div>
            </div>
            <div className="button-grid">
                {buttons.map(([label, className, onclick], index) => {
                    if (label === "AC" && current !== "0") {
                        return null;
                    }
                    if (label === "<=" && current === "0") {
                        return null;
                    }
                    return (
                        <button 
                            key={index}
                            className={`button ${className}`}
                            onClick={onclick}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>  
            <div className={`history-panel ${showHistory ? "show" : "hide"}`}>
                <div className="history-header">
                    <div className="drag-bar"></div>
                    <button className="close-btn" onClick={() => {setShowHistory(false); setShowCheckboxes(false);}}>xong</button>
                </div>
                <div className="history-body">
                    <div className="time">Hôm nay</div>
                    {history.map((item, index) => (
                        <div key={index}>
                            <div className="history-item">
                                {showCheckboxes && <Checkbox onChange={e => handleCheckboxChange(index, e.target.checked)} />}
                                <div className="history-content">
                                    <div className="expression">{item.expression}</div>
                                    <div className="result">{item.result}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="history-footer">
                    <button className="edit-btn" onClick={() => setShowCheckboxes(!showCheckboxes)}>sửa</button>
                    <button className="delete-btn" onClick={() => {
                        if (selectedItems.length === 0) {
                            setHistory([]);
                        } else {
                            setHistory(prev => prev.filter((_, index) => !selectedItems.includes(index)));
                        }
                        setSelectedItems([]);
                        setShowCheckboxes(false);
                    }}>xóa</button>
                </div>
            </div>
        </div>
    )
}
export default App;