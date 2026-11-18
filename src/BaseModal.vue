
<script setup>
import { Transition } from 'vue';

const emit = defineEmits([
"close"
])
const props = defineProps({
open:Boolean
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-backdrop" v-if="open">
        <section class="EditModal" role="dialog" aria-label="Edzésnapló párbeszédablak">
          <header class="modal-header">
            <slot name="header" />
          </header>
          <div class="modal-content"><slot /></div>
          <footer class="modal-footer">
            <slot name="footer" />
          </footer>
          <div class="modal-close"><button @click="emit('close')" type="button" class="closebutton">Bezárás</button></div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgb(20 37 29 / 48%); display: flex; align-items: center; justify-content: center; padding: 24px; overflow-y: auto; }
.EditModal { width: 100%; max-width: 480px; max-height: calc(100dvh - 48px); overflow-y: auto; overscroll-behavior: contain; padding: 28px; border: 1px solid var(--border); border-radius: 20px; background: #fff; color: #233632; box-shadow: 0 24px 80px #13251d33; }
.modal-header { margin-bottom: 24px; }
.modal-header:empty { display: none; }
.modal-content { display: grid; gap: 20px; font-size: .9375rem; }
.modal-footer { margin-top: 20px; color: var(--muted); font-size: .8rem; }
.modal-footer:empty { display: none; }
.modal-close { display: flex; justify-content: flex-end; border-top: 1px solid var(--border); margin-top: 24px; padding-top: 16px; }
.modal-enter-active, .modal-leave-active { transition: opacity .18s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@media (max-width: 520px) {
  .modal-backdrop { padding: 16px; }
  .EditModal { max-height: calc(100dvh - 32px); padding: 22px; border-radius: 16px; }
}
@media (prefers-reduced-motion: reduce) { .modal-enter-active, .modal-leave-active { transition: none; } }
</style>