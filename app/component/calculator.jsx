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

    // Handle touch events for mobile dragging
    const handleTouchStart = (e) => {
        if (e.target.classList.contains('calculator-header') || 
            e.target.classList.contains('calculator-title')) {
            setIsDragging(true);
            const touch = e.touches[0];
            setDragStart({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

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
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    // Handle body overflow when calculator is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Center calculator on mobile when opening
            if (window.innerWidth <= 640) {
                setPosition({
                    x: window.innerWidth / 2 - 140,
                    y: window.innerHeight / 2 - 200
                });
            }
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
                          border-none cursor-pointer shadow-md hover:bg-green-700 
                          transition-colors duration-200 flex items-center justify-center
                          sm:w-14 sm:h-14"
                aria-label="Open calculator"
            >
                <CalculatorIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
        );
    }

    return (
        <>
            {/* Semi-transparent black overlay */}
            <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={toggleCalculator}
            />
            
            {/* Calculator container */}
            <div 
                className="fixed z-50 w-[280px] sm:w-72 max-w-full shadow-lg rounded-lg overflow-hidden bg-white"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    touchAction: 'none' // Prevent scrolling when dragging on mobile
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="calculator-header bg-green-600 text-white px-3 py-2 
                                flex justify-between items-center cursor-move select-none">
                    <h3 className="calculator-title m-0 text-base sm:text-lg font-medium"> ExamDesk Calculator</h3>
                    <button 
                        onClick={toggleCalculator}
                        className="bg-transparent border-none text-white text-lg cursor-pointer hover:opacity-80"
                        aria-label="Close calculator"
                    >
                        ×
                    </button>
                </div>
                
                {/* Display with black/50 background */}
                <div className="bg-white bg-opacity-50 p-3 sm:p-4">
                    <div className="text-right text-xs sm:text-sm text-black/80 h-4 sm:h-5 overflow-hidden">
                        {operationDisplay}
                    </div>
                    <div className="text-right text-xl sm:text-2xl font-medium mt-1 text-wblack overflow-hidden">
                        {display}
                    </div>
                </div>
                
                {/* Calculator buttons grid */}
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
        </>
    );
}

function CalculatorButton({ children, onClick, operation = false, span2 = false }) {
    return (
        <button
            onClick={onClick}
            className={`p-3 sm:p-4 text-base sm:text-lg cursor-pointer transition-colors duration-200 
                       ${operation ? 'bg-orange-500 hover:bg-orange-600 text-white' : 
                          'bg-white hover:bg-gray-100'}
                       ${span2 ? 'col-span-2' : ''}
                       active:scale-95`} // Add press effect on mobile
            aria-label={typeof children === 'string' ? children : ''}
        >
            {children}
        </button>
    );
}