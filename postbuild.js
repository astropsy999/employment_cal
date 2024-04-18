const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); // Require fs-extra

const indexPath = path.join(__dirname, 'build', 'index.html');
const destDir = 'C:/gdc/portal/emplcal';
const scriptsDestination = 'C:/gdc/portal/emplcal/assets';
const sourceDir = path.resolve(__dirname, 'build');
const buildDir = path.join(__dirname, 'build');
const jsDir = path.join(buildDir, 'static', 'js');
const cssDir = path.join(buildDir, 'static', 'css');
let newJsName, newCssName;

// Функция для переименования файлов и удаления лишних файлов
function renameAndCleanupFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    files.forEach((file) => {
      if (file.endsWith('.js') || file.endsWith('.css')) {
        const oldPath = path.join(directory, file);
        const newName = file.replace(/(\.[^.]+)$/, '.min$1');
        if (file.endsWith('.js')) {
          newJsName = file.replace(/(\.[^.]+)$/, '.min$1');
        }
        if (file.endsWith('.css')) {
          newCssName = file.replace(/(\.[^.]+)$/, '.min$1');
        }

        const newPath = path.join(directory, newName);
        console.log('newPath: ', newPath);

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error(`Error renaming file ${file}:`, err);
            return;
          }
          console.log(`Renamed ${file} to ${newName}`);
        });
      } else {
        // Удаление лишних файлов
        fs.unlink(path.join(directory, file), (err) => {
          if (err) {
            console.error(`Error deleting file ${file}:`, err);
            return;
          }
          console.log(`Deleted ${file}`);
        });
      }
    });

    modifyIndexHtml(newJsName, newCssName);
  });
}

// Функция для изменения ссылок в index.html
function modifyIndexHtml(newJsName, newCssName) {
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return;
    }

    // Замена ссылок на скрипты и стили
    const modifiedData = data
      .replace(/main\.[a-f0-9]+\.js/g, `${newJsName}`)
      .replace(/main\.[a-f0-9]+\.css/g, `${newCssName}`);

    // Запись измененных данных обратно в файл
    fs.writeFile(indexPath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing modified index.html:', err);
        return;
      }
      console.log('Index.html has been modified successfully.');
    });
  });
}

// Функция для копирования файлов и изменения ссылок в index.html
function copyAndModifyFiles() {
  // Проверка существования исходной папки
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir);
    process.exit(1);
  }

  // Проверка существования целевой папки, если нет - создание ее
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Проверка существования и очистка целевой папки
  if (fs.existsSync(destDir)) {
    fse.emptyDirSync(destDir);
  } else {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Вызываем функции для обработки файлов в папке с JavaScript и CSS
  renameAndCleanupFiles(jsDir);
  renameAndCleanupFiles(cssDir);

  // Копирование файлов из исходной папки в целевую
  fse.copy(sourceDir, destDir, (err) => {
    if (err) {
      console.error('Error copying files:', err);
      process.exit(1);
    }
    console.log('Files copied successfully from', sourceDir, 'to', destDir);
  });
}

// Вызываем функцию для копирования файлов и изменения ссылок
copyAndModifyFiles();
