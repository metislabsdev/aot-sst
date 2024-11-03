import React from 'react';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ProfileMenu } from './profile-menu';
import { ActionMenu } from './action-menu';

const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Macro', href: '#', current: false },
  {
    name: 'Crypto',
    href: '#',
    current: false,
    children: [{ name: 'Bitcoin', href: '#', current: false }],
  },
  { name: 'Stocks', href: '#', current: false },
  { name: 'Grayscale', href: '#', current: false },
  { name: 'Resources', href: '#', current: false },
  { name: 'Workflows', href: '#', current: false },
];

interface NestedMenuItem {
  name: string;
  href: string;
  current: boolean;
  children?: NestedMenuItem[];
}

function NavListLayerOneMenu({ nestedMenuItem }: { nestedMenuItem: NestedMenuItem }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openNestedMenu, setopenNestedMenu] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { children } = nestedMenuItem;
  const renderItems = children?.map(({ name }, key) => (
    <a href="#" key={key}>
      <MenuItem>{name}</MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom" allowHover={true}>
        <MenuHandler>
          <Typography
            as="div"
            variant="small"
            className="font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <ListItem
              className="font-mediu flex items-center gap-2 py-2 pr-4"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              {nestedMenuItem.name}
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-xl lg:block">
          <Menu
            placement="right-start"
            allowHover
            offset={15}
            open={openNestedMenu}
            handler={setopenNestedMenu}
          >
            {children?.map((item, index) => <MenuItem key={index}>{item.name}</MenuItem>)}
          </Menu>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>
          <Menu
            placement="bottom"
            allowHover
            offset={6}
            open={openNestedMenu}
            handler={setopenNestedMenu}
          >
            <MenuHandler className="flex items-center justify-between">
              <MenuItem>
                Figma
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
                />
              </MenuItem>
            </MenuHandler>
            <MenuList className="block rounded-xl lg:hidden">{renderItems}</MenuList>
          </Menu>
          <MenuItem>React</MenuItem>
          <MenuItem>TailwindCSS</MenuItem>
        </Collapse>
      </div>
    </React.Fragment>
  );
}

function NavListItem({ item }: { item: NestedMenuItem }) {
  const { children } = item;
  if (children) {
    return (
      <>
        <NavListLayerOneMenu nestedMenuItem={item} />
      </>
    );
  } else {
    return (
      <ListItem className="flex items-center gap-2 py-2 pr-4 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        {item.name}
      </ListItem>
    );
  }
}

function NavList() {
  return (
    <List className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1">
      {navigation.map((item, index) => (
        <Typography
          as="a"
          href="#"
          variant="small"
          color="white"
          className="font-medium text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          key={index}
        >
          <NavListItem item={item} key={index} />
        </Typography>
      ))}
    </List>
  );
}

export default function NavigationbarWithDropdownMultilevelMenu() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  return (
    <Navbar
      className="max-w-full rounded-none from-blue-gray-900 to-blue-gray-800 py-2"
      variant="gradient"
      color="blue-gray"
    >
      <div className="flex items-center justify-between text-white">
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          <ActionMenu />
          <ProfileMenu />
        </div>
        <IconButton variant="text" className="lg:hidden" onClick={() => setOpenNav(!openNav)}>
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      {/* Mobile menu */}
      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          <Button size="sm" fullWidth>
            Get Started
          </Button>
          <Button variant="outlined" size="sm" fullWidth>
            Log In
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
}
