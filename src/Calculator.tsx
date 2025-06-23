import React from "react";
import "./Calculator.css";
import { Checkbox } from 'antd';
import IconComponent from "./Icon";
import { FaDivide, FaList } from 'react-icons/fa';
import { TiCalculator } from 'react-icons/ti';

type HistoryItem = {
        expression: string;
        result: string;
        date: string;
    }

function App() {
    const [current, setCurrent] = React.useState<string>("0");
    const [previous, setPrevious] = React.useState<string>("");
    const [operator, setOperator] = React.useState<string|null>(null);
    const [overWrite, setOverWrite] = React.useState<boolean>(false);
    const [expression, setExpression] = React.useState<string>("");
    const [history, setHistory] = React.useState<HistoryItem[]>(() => {
        try {
            const saved = localStorage.getItem("history");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                } else {
                    console.warn("", parsed);
                }
            }
        } catch (e) {
            console.error("", e);
        }
        return [];
    });
    const [showHistory, setShowHistory] = React.useState<boolean>(false);
    const [showCheckboxes, setShowCheckboxes] = React.useState<boolean>(false);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

    const clear = () => {
        setCurrent("0");
        setPrevious("");
        setOperator(null);
        setOverWrite(false);    
        setExpression("");
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
        if ((!operator || previous === "") && operator !== "%") return;

        let result = 0;
        let expression = "";

        switch (operator) {
            case "+":
                result = parseFloat(previous) + parseFloat(current);
                expression = `${previous} + ${current}`;
                break;
            case "-":
                result = parseFloat(previous) - parseFloat(current);
                expression = `${previous} - ${current}`;
                break;
            case "x":
                result = parseFloat(previous) * parseFloat(current);
                expression = `${previous} x ${current}`;
                break;
            case "/":
                result = parseFloat(previous) / parseFloat(current);
                expression = `${previous} / ${current}`;
                break;
            case "%":
                result = parseFloat(current) / 100;
                expression = `${current}%`;
                break;
            default:
                return;
            }

        setCurrent(result.toString());
        setPrevious("");
        setOperator(null);
        setOverWrite(true);
        setExpression(expression)
        setHistory(prev => [
        ...prev,
            {
            expression,
            result: result.toString(),
            date: new Date().toISOString(),
            }
        ]);
    };

    const buttons: [React.ReactNode, string, () => void] [] =[
        ["<=", "function", deleteHandle],
        ["AC", "function", clear],
        ["±", "function", changeSign],
        ["%", "function", () => chooseOperator("%")],
        [<IconComponent icon={FaDivide as React.ElementType}/>, "operator", () => chooseOperator("/")],

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

        [<IconComponent icon={TiCalculator as React.ElementType}/>, "number", () => console.log("Calculator icon clicked")],
        ["0", "number", () => chooseNumber("0")],
        [".", "number", () => chooseNumber(".")],
        ["=", "operator", calculate]
    ]

    React.useEffect(() => {
        try {
            localStorage.setItem("history", JSON.stringify(history));
        } catch (e) {
            console.error("", e);
        }
    }, [history]);

    return (
        <div className="calculator">
            <div className="list" onClick={() => setShowHistory(true)}><IconComponent icon={FaList as React.ElementType} /></div>
            <div className="display">
                <div className="previous">{expression || (operator ? `${previous} ${operator}` : previous)}</div>
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
                    {Object.entries(history.reduce((acc, item) => {
                        const dateObj = new Date(item.date);
                        const today = new Date();
                        const yesterday = new Date();
                        yesterday.setDate(today.getDate() - 1);

                        const isToday = dateObj.toDateString() === today.toDateString();
                        const isYesterday = dateObj.toDateString() === yesterday.toDateString();

                        let dateLabel = "";
                        if (isToday) {
                            dateLabel = "Hôm nay";
                        } else if (isYesterday) {
                            dateLabel = "Hôm qua";
                        } else {
                            dateLabel = dateObj.toLocaleDateString();
                        }

                        if (!acc[dateLabel]) {
                            acc[dateLabel] = [];
                        }
                        acc[dateLabel].push(item);
                        return acc;
                    }, {} as Record<string, HistoryItem[]>)).map(([date, items]) => (
                        <div key={date}>
                            <div className="time">{date}</div>
                            {items.map((item, index) => {
                                const globalIndex = history.findIndex(h => h === item);
                                return (
                                    <div key={globalIndex} className="history-item">
                                        {showCheckboxes && <Checkbox onChange={e => handleCheckboxChange(globalIndex, e.target.checked)} />}
                                        <div className="history-content" onClick={()=>{
                                            
                                        }}>
                                            <div className="expression">{item.expression}</div>
                                            <div className="result">{item.result}</div>
                                        </div>
                                    </div>
                                );
                            })}
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