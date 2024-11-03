import { Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';
import { useModal } from '../../../../hooks/useModal';
import AddAssetForm from '../../../add-asset/form';
import AddWalletForm from '../../../add-wallet/form';

type AddButtonNavigationItem = {
  name: string;
  buttonAction: () => void;
};

export function ActionMenu() {
  const { openModal } = useModal();

  const handleOpenModal = (element: React.ReactNode, label: string): void => {
    openModal(element, label);
  };

  const addButonNavigation = [
    { name: 'Add Asset', buttonAction: () => handleOpenModal(<AddAssetForm />, 'Add Asset') },
    { name: 'Add Wallet', buttonAction: () => handleOpenModal(<AddWalletForm />, 'Add Wallet') },
  ];
  return (
    <>
      <Menu>
        <MenuHandler>
          <Button className="flex items-center gap-3 bg-indigo-500 text-sm text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>
            Actions
          </Button>
        </MenuHandler>
        <MenuList>
          {addButonNavigation.map((item: AddButtonNavigationItem, index: number) => (
            <MenuItem key={index} onClick={item.buttonAction}>
              {item.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}
