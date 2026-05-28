<template>
  <div>
    <Disclosure v-slot="{ open }" as="nav" class="relative bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-20 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton
              class="
                relative
                inline-flex
                items-center
                justify-center
                rounded-md
                p-2
                text-gray-400
                hover:bg-white/5
                hover:text-white
                focus:outline-2
                focus:-outline-offset-1
                focus:outline-indigo-500
              "
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" aria-hidden="true" class="block size-6" />
              <XMarkIcon v-else aria-hidden="true" class="block size-6" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex shrink-0 items-center">
              <img alt="Your Company" class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500">
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <button
                  v-for="item in navigation"
                  :key="item.name"
                  :aria-current="item.current ? 'page' : undefined"
                  :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']"
                  type="button"
                  @click="navigateTo(item.href)"
                >{{ item.name }}</button>
              </div>
            </div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button class="relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" type="button">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" class="size-6" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <MenuButton class="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <img alt="" class="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80">
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5">
                  <MenuItem v-slot="{ active }">
                    <a :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']" href="#">Your profile</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']" href="#">Settings</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a :class="[active ? 'bg-gray-100 outline-hidden' : '', 'block px-4 py-2 text-sm text-gray-700']" href="#">Sign out</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3">
          <DisclosureButton
            v-for="item in navigation"
            :key="item.name"
            :aria-current="item.current ? 'page' : undefined"
            as="button"
            :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            type="button"
            @click="navigateTo(item.href)"
          >{{ item.name }}</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <v-app>
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Team', href: '/team' },
    { name: 'Projects', href: '/projects' },
    { name: 'Calendar', href: '/calendar' },
  ]

  const navigation = ref(navigationItems.map(item => ({
    ...item,
    current: item.href === route.path,
  })))

  watch(() => route.path, newPath => {
          console.log('Route changed to:', newPath)
          navigation.value = navigationItems.map(item => ({
            ...item,
            current: item.href === newPath,
          }))
        },
        { immediate: true },
  )
  // const navigation = computed(
  //   () => {
  //     return navigationItems.map(item => ({
  //       ...item,
  //       current: item.href === route.path,
  //     }))
  //   },
  // )

  onMounted(() => {
    console.log('Current route:', route.path)
  })

  onRenderTracked(event => {
    console.log('Render tracked:', event)
  })
  onRenderTriggered(event => {
    console.log('Render triggered:', event)
  })
</script>
