import { stringify } from 'csv-stringify';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const filePath = path.resolve(__dirname, 'buildingNumbers.txt');

const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject("I couldn't read this file");
            resolve(data);
        });
    });
};

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject("I couldn't write this file");
            resolve('successfully');
        });
    });
};

const validateNumber = (num) => {
    const regexp =
        /(?!0)^[0-9]{1,3}(?![а-щьюяґєії]+[0-9])(?![0-9])[а-щьюяґєії]?[-/]?([0-9]{0,3})$/;

    return !!num.match(regexp);
};

const checkBuildingNumber = (buildingNumber) => {
    if (buildingNumber) {
        let isValid = validateNumber(buildingNumber.toString());

        return console.log(isValid);
    }

    readFilePro(filePath)
        .then((data) => {
            let validatedArr = [];

            data.split('\n').map((item) => {
                validatedArr.push([item, `${validateNumber(item)}`]);
            });

            return validatedArr;
        })
        .then((res) => {
            let columns = {
                buildNumber: 'Build Number',
                isCorrect: 'Correct',
            };

            stringify(
                res,
                { header: true, columns: columns },
                (err, output) => {
                    if (err) throw err;
                    writeFilePro('result.csv', output);
                }
            );
        })
        .then(() => {
            console.log('All building numbers checked');
        })
        .catch((err) => {
            console.log(err.message);
        });
};

checkBuildingNumber();
