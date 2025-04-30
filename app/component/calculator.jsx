"use client"
import { CalculatorIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Calculator() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [operationDisplay, setOperationDisplay] = useState('');

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('calculator-header') || 
            e.target.classList.contains('calculator-title')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(String(digit));
            setWaitingForOperand(false);
            setOperationDisplay(`${previousValue} ${operation} `);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            setOperationDisplay(`${previousValue} ${operation} `);
            return;
        }

        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
        setOperationDisplay('');
    };

    const performOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
            setOperationDisplay(`${inputValue} ${nextOperation} `);
        } else if (operation) {
            const currentValue = previousValue || 0;
            let newValue;
            
            switch (operation) {
                case '+':
                    newValue = currentValue + inputValue;
                    break;
                case '-':
                    newValue = currentValue - inputValue;
                    break;
                case '*':
                    newValue = currentValue * inputValue;
                    break;
                case '/':
                    newValue = currentValue / inputValue;
                    break;
                default:
                    newValue = inputValue;
            }

            setPreviousValue(newValue);
            setDisplay(String(newValue));
            setOperationDisplay(`${newValue} ${nextOperation} `);
        } else {
            setOperationDisplay(`${inputValue} ${nextOperation} `);
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const handleEquals = () => {
        if (!operation || previousValue === null) return;
        
        const inputValue = parseFloat(display);
        let newValue;
        
        switch (operation) {
            case '+':
                newValue = previousValue + inputValue;
                break;
            case '-':
                newValue = previousValue - inputValue;
                break;
            case '*':
                newValue = previousValue * inputValue;
                break;
            case '/':
                newValue = previousValue / inputValue;
                break;
            default:
                newValue = inputValue;
        }

        setDisplay(String(newValue));
        setOperationDisplay(`${previousValue} ${operation} ${inputValue} =`);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
    };

    const toggleCalculator = () => {
        setIsOpen(!isOpen);
    };

    const handlePercentage = () => {
        const value = parseFloat(display);
        setDisplay(String(value / 100));
    };

    const handlePlusMinus = () => {
        const value = parseFloat(display);
        setDisplay(String(-value));
    };

    if (!isOpen) {
        return (
            <button 
                onClick={toggleCalculator}
                className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-green-600 text-white 
                          border-none text-xl cursor-pointer shadow-md hover:bg-green-700 
                          transition-colors duration-200 flex items-center justify-center"
            >
            <CalculatorIcon/>
            </button>
        );
    }

    return (
        
        <div 
            className="fixed z-100 w-72 max-w-full shadow-lg rounded-lg overflow-hidden bg-white "
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="calculator-header bg-green-600 text-white px-3 py-2 
                            flex justify-between items-center cursor-move">
                <h3 className="calculator-title m-0 text-lg font-medium">ExamDesk Calculator</h3>
                <button 
                    onClick={toggleCalculator}
                    className="bg-transparent border-none text-white text-base cursor-pointer hover:opacity-80"
                >
                    ×
                </button>
            </div>
            
            <div className="bg-gray-100 p-4">
                <div className="text-right text-sm text-gray-600 h-5 overflow-hidden">
                    {operationDisplay}
                </div>
                <div className="text-right text-2xl font-medium mt-1 overflow-hidden">
                    {display}
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-px bg-gray-300">
                <CalculatorButton onClick={clearDisplay}>AC</CalculatorButton>
                <CalculatorButton onClick={handlePlusMinus}>±</CalculatorButton>
                <CalculatorButton onClick={handlePercentage}>%</CalculatorButton>
                <CalculatorButton operation onClick={() => performOperation('/')}>÷</CalculatorButton>
                
                <CalculatorButton onClick={() => inputDigit(7)}>7</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(8)}>8</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(9)}>9</CalculatorButton>
                <CalculatorButton operation onClick={() => performOperation('*')}>×</CalculatorButton>
                
                <CalculatorButton onClick={() => inputDigit(4)}>4</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(5)}>5</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(6)}>6</CalculatorButton>
                <CalculatorButton operation onClick={() => performOperation('-')}>-</CalculatorButton>
                
                <CalculatorButton onClick={() => inputDigit(1)}>1</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(2)}>2</CalculatorButton>
                <CalculatorButton onClick={() => inputDigit(3)}>3</CalculatorButton>
                <CalculatorButton operation onClick={() => performOperation('+')}>+</CalculatorButton>
                
                <CalculatorButton span2 onClick={() => inputDigit(0)}>0</CalculatorButton>
                <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
                <CalculatorButton operation onClick={handleEquals}>=</CalculatorButton>
            </div>
        </div>
    );
}

function CalculatorButton({ children, onClick, operation = false, span2 = false }) {
    return (
        <button
            onClick={onClick}
            className={`p-4 text-lg cursor-pointer transition-colors duration-200 
                       ${operation ? 'bg-orange-500 hover:bg-orange-600 text-white' : 
                          'bg-white hover:bg-gray-100'}
                       ${span2 ? 'col-span-2' : ''}`}
        >
            {children}
        </button>
    );
}