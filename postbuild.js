// postbuild.js

const fs = require('fs-extra');
const path = require('path');

// Определяем пути
const sourceDir = path.resolve(__dirname, 'prod'); // Папка с результатами сборки
const targetDir = 'C:\\gdc\\portal\\emplcal'; // Целевая директория на продакшен

async function deploy() {
  try {
    console.log(`\nНачало процесса развертывания...`);
    
    // Проверяем, существует ли целевая директория
    const targetExists = await fs.pathExists(targetDir);
    if (!targetExists) {
      console.log(`Целевая директория не существует. Создаём ${targetDir}`);
      await fs.ensureDir(targetDir);
    }

    // Удаляем содержимое целевой директории
    console.log(`Удаление старых файлов из ${targetDir}...`);
    await fs.emptyDir(targetDir);
    console.log(`Старые файлы успешно удалены.`);

    // Копируем новые файлы из папки prod в целевую директорию
    console.log(`Копирование новых файлов из ${sourceDir} в ${targetDir}...`);
    await fs.copy(sourceDir, targetDir);
    console.log(`Файлы успешно скопированы.`);

    console.log(`\nПроцесс развертывания завершён успешно!`);
  } catch (err) {
    console.error(`\nПроизошла ошибка при развертывании:`, err);
    process.exit(1); // Завершаем процесс с ошибкой
  }
}

deploy();
