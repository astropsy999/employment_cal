import { deleteNodeURL, srvv } from "../config";

/**
 * Удаляет метод с сервера по заданному ID
 * @param {string} methDelID - ID метода для удаления
 * @returns {Promise<void>}
 */
const deleteMethodFromTableApi = async (
    methDelID: string,
  ): Promise<void> => {
    try {
      const response = await fetch(
        `${srvv}${deleteNodeURL}?ID=${methDelID}&TypeID=1149&TabID=1685`,
        {
          credentials: 'include',
          method: 'GET',
        },
      );
  
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Метод удален с сервера:', data);
    } catch (error) {
      console.error('Ошибка при удалении метода с сервера:', error);
    }
  };
  
  export default deleteMethodFromTableApi;