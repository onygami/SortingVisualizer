import React from 'react';
import './App.scss';
import ArraySizeSelector from './TopBar/ArraySizeSelector';
import AlgorithmSelector from './TopBar/AlgorithmSelector';
import ArrayTypeSelector from './TopBar/ArrayTypeSelector';
import SortingAlgorithms from './TopBar/SortingAlgorithms';

class Strip {
    constructor(length = 10, color = 'rgb(25, 125, 51)') {
        this.length = length;
        this.color = color;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arraySize: 50,
            stripsArray: [],
            sortingAlgorithm: SortingAlgorithms[0],
            arrayType: 'Random'
        };
    }
    surfaceHeight = 500; // px

    componentDidMount = () => {
        this.setState({
            stripsArray: this.generateStripsArray(
                this.state.arraySize,
                this.state.arrayType,
                this.surfaceHeight
            )
        });
    };

    generateStripsArray = (arraySize, arrayType, maxValue) => {
        let stripLengthArray = [];
        switch (arrayType) {
            case 'Random':
                for (let i = 0; i < arraySize; i++) {
                    stripLengthArray.push(Math.ceil(Math.random() * maxValue));
                }
                break;

            case 'Almost Sorted':
                let increment = (maxValue - 10) / (arraySize - 1);
                for (let val = 10; val <= maxValue; val += increment) {
                    stripLengthArray.push(Math.floor(val));
                }
                [stripLengthArray[2], stripLengthArray[arraySize - 3]] = [
                    stripLengthArray[arraySize - 3],
                    stripLengthArray[2]
                ];
                break;

            case 'Reversed':
                let decrement = (maxValue - 10) / (arraySize - 1);
                for (let val = maxValue; val >= 10; val -= decrement) {
                    stripLengthArray.push(Math.floor(val));
                }
                break;

            default:
                break;
        }

        // let scaleFactor = maxValue / 10;

        let strips = stripLengthArray.map(length => {
            // let hue = 0,
            //     saturation = 100,
            //     luminosity = length / scaleFactor + 90;
            // let color = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
            let color = 'white';
            return new Strip(length, color);
        });

        return strips;
    };

    sleep(ms = 0) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    swap = async (arr, i, j) => {
        [arr[i], arr[j]] = [arr[j], arr[i]];

        await this.sleep();
        this.setState({
            stripsArray: arr
        });
    };

    runSort = (array, swapMethod) => {
        this.state.sortingAlgorithm.method(array, swapMethod);
    };

    handleArraySizeSelector = arraySize => {
        this.setState({
            arraySize: arraySize,
            stripsArray: this.generateStripsArray(
                arraySize,
                this.state.arrayType,
                this.surfaceHeight
            )
        });
    };

    handleAlgorithmSelector = algorithm => {
        this.setState({
            sortingAlgorithm: algorithm
        });
    };

    handleArrayTypeSelector = arrayType => {
        this.setState({
            arrayType: arrayType,
            stripsArray: this.generateStripsArray(
                this.state.arraySize,
                arrayType,
                this.surfaceHeight
            )
        });
    };

    TopBar = () => {
        return (
            <span>
                <AlgorithmSelector
                    onChangeHandler={this.handleAlgorithmSelector}
                />

                <ArraySizeSelector
                    min={10}
                    max={1000}
                    step={5}
                    defaultValue={this.state.arraySize}
                    onChangeHandler={this.handleArraySizeSelector}
                />

                <ArrayTypeSelector
                    onChangeHandler={this.handleArrayTypeSelector}
                />

                <button
                    onClick={() =>
                        this.runSort(this.state.stripsArray, this.swap)
                    }
                >
                    Sort
                </button>
            </span>
        );
    };

    Strips = () => {
        return this.state.stripsArray.map(strip => {
            const stripStyles = {
                height: `${strip.length}px`,
                backgroundColor: strip.color
            };
            return (
                <span
                    key={this.uuidv4()}
                    className="strip"
                    style={stripStyles}
                ></span>
            );
        });
    };

    render() {
        const surfaceStyles = {
            width: '80%',
            height: `${this.surfaceHeight}px`
        };

        return (
            <div>
                <this.TopBar />
                <span className="surface" ref="surface" style={surfaceStyles}>
                    <this.Strips />
                </span>
            </div>
        );
    }
}

export default App;